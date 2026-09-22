import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import {
  parseProjectJson,
  serializeProject,
} from '../Apps/builder/src/projectJson.ts'
import { isSafeHref } from '@buildotron/plugin-sdk'
import { createSection } from '../Apps/builder/src/project.ts'

const sample = readFileSync(
  new URL('../projects/product-landing.json', import.meta.url),
  'utf8',
)

test('the repository project survives a JSON round trip', () => {
  const project = parseProjectJson(sample)
  assert.deepEqual(parseProjectJson(serializeProject(project)), project)
  assert.equal(project.sections.length, 3)
})

test('invalid sections are rejected', () => {
  const project = JSON.parse(sample)
  project.sections[1].id = project.sections[0].id
  assert.throws(() => parseProjectJson(JSON.stringify(project)), /dupliqué/)

  project.sections[1].id = 'another-id'
  project.sections[1].slot = 'footer'
  assert.throws(
    () => parseProjectJson(JSON.stringify(project)),
    /sans override/,
  )

  project.sections[1].override = true
  assert.equal(
    parseProjectJson(JSON.stringify(project)).sections[1].slot,
    'footer',
  )
})

test('every section needs a nonempty title and body before saving or opening', () => {
  const project = parseProjectJson(sample)
  for (const section of project.sections) {
    for (const key of ['title', 'body']) {
      const invalid = structuredClone(project)
      invalid.sections.find((item) => item.id === section.id).properties[key] =
        '  '
      assert.throws(
        () => parseProjectJson(serializeProject(invalid)),
        /titre et le texte sont obligatoires/,
      )
    }
  }
})

test('unsupported versions and malformed JSON are rejected', () => {
  assert.throws(() => parseProjectJson('{'), /JSON valide/)
  const project = JSON.parse(sample)
  project.formatVersion = 2
  assert.throws(
    () => parseProjectJson(JSON.stringify(project)),
    /Version du format/,
  )
})

test('legacy CTA data gains editable action defaults and preserves a configured link', () => {
  const legacy = parseProjectJson(sample)
  const cta = legacy.sections.find((section) => section.type === 'CTA')
  assert.equal(cta.properties.actionLabel, 'Get started')
  assert.equal(cta.properties.actionHref, '')

  cta.properties.actionLabel = 'Contact us'
  cta.properties.actionHref = '/contact'
  const reopened = parseProjectJson(serializeProject(legacy))
  assert.equal(
    reopened.sections.find((section) => section.type === 'CTA').properties
      .actionHref,
    '/contact',
  )
})

test('legacy Hero data gains optional action defaults and validates its link', () => {
  const project = parseProjectJson(sample)
  const hero = project.sections.find((section) => section.type === 'Hero')
  assert.equal(hero.properties.actionLabel, 'Learn more')
  assert.equal(hero.properties.actionHref, '')

  hero.properties.actionLabel = 'See the details'
  hero.properties.actionHref = '/details'
  const reopened = parseProjectJson(serializeProject(project))
  assert.equal(
    reopened.sections.find((section) => section.type === 'Hero').properties
      .actionHref,
    '/details',
  )

  hero.properties.actionHref = 'javascript:alert(1)'
  assert.throws(
    () => parseProjectJson(serializeProject(project)),
    /lien du Hero/,
  )
})

test('CTA links accept web and local destinations and reject unsafe schemes', () => {
  for (const href of [
    'https://example.com',
    'http://example.com',
    '/contact',
    '#contact',
  ]) {
    assert.equal(isSafeHref(href), true)
  }
  for (const href of [
    'javascript:alert(1)',
    'data:text/html,hello',
    '//example.com',
    '/\\example.com',
    'https://example.com\n',
  ]) {
    assert.equal(isSafeHref(href), false)
  }
  const project = JSON.parse(sample)
  project.sections[2].properties.actionHref = 'javascript:alert(1)'
  assert.throws(() => parseProjectJson(JSON.stringify(project)), /lien du CTA/)
})

test('Features items survive JSON reopening and invalid lists are refused', () => {
  const project = parseProjectJson(sample)
  const features = project.sections.find(
    (section) => section.type === 'Features',
  )
  assert.equal(features.properties.items.length, 3)
  features.properties.items[0].title = 'Custom benefit'
  const reopened = parseProjectJson(serializeProject(project))
  assert.equal(
    reopened.sections.find((section) => section.type === 'Features').properties
      .items[0].title,
    'Custom benefit',
  )

  features.properties.items = [{ title: '', body: 'Text' }]
  assert.throws(
    () => parseProjectJson(serializeProject(project)),
    /éléments de Features/,
  )
})

test('Gallery images round trip and reject unsafe sources or missing alt text', () => {
  const project = parseProjectJson(sample)
  const gallery = createSection('Gallery')
  gallery.properties.images = [
    { src: '/gallery-validation.svg', alt: 'Motif de validation' },
  ]
  project.sections.push(gallery)
  const reopened = parseProjectJson(serializeProject(project))
  assert.deepEqual(
    reopened.sections.find((section) => section.id === gallery.id).properties
      .images,
    gallery.properties.images,
  )

  gallery.properties.images[0].src = 'javascript:alert(1)'
  assert.throws(
    () => parseProjectJson(serializeProject(project)),
    /image Gallery/,
  )
  gallery.properties.images[0].src = '/gallery-validation.svg'
  gallery.properties.images[0].alt = '  '
  assert.throws(
    () => parseProjectJson(serializeProject(project)),
    /image Gallery/,
  )
})

test('FAQ questions survive JSON reopening and require complete answers', () => {
  const project = parseProjectJson(sample)
  const faq = createSection('FAQ')
  faq.properties.questions = [
    { question: 'How do I start?', answer: 'Open the Builder.' },
    { question: 'Can I save?', answer: 'Yes, as JSON.' },
  ]
  project.sections.push(faq)
  const reopened = parseProjectJson(serializeProject(project))
  assert.deepEqual(
    reopened.sections.find((section) => section.id === faq.id).properties
      .questions,
    faq.properties.questions,
  )

  faq.properties.questions[0].answer = '  '
  assert.throws(
    () => parseProjectJson(serializeProject(project)),
    /questions FAQ/,
  )

  const legacy = structuredClone(project)
  delete legacy.sections.find((section) => section.id === faq.id).properties
    .questions
  assert.equal(
    parseProjectJson(serializeProject(legacy)).sections.find(
      (section) => section.id === faq.id,
    ).properties.questions.length,
    1,
  )
})

test('Footer links survive JSON reopening and reject unsafe destinations', () => {
  const project = parseProjectJson(sample)
  const footer = createSection('Footer')
  footer.properties.links = [
    { label: 'Legal notice', href: '/legal' },
    { label: 'Contact', href: '#contact' },
  ]
  project.sections.push(footer)
  const reopened = parseProjectJson(serializeProject(project))
  assert.deepEqual(
    reopened.sections.find((section) => section.id === footer.id).properties
      .links,
    footer.properties.links,
  )

  footer.properties.links[0].href = 'javascript:alert(1)'
  assert.throws(
    () => parseProjectJson(serializeProject(project)),
    /lien Footer/,
  )
  footer.properties.links[0].href = '/legal'
  footer.properties.links[0].label = '  '
  assert.throws(
    () => parseProjectJson(serializeProject(project)),
    /lien Footer/,
  )
})

test('Navbar links survive JSON reopening and reject unsafe destinations', () => {
  const project = parseProjectJson(sample)
  const navbar = createSection('Navbar')
  navbar.properties.links = [
    { label: 'Accueil', href: '/' },
    { label: 'Contact', href: '#contact' },
  ]
  project.sections.push(navbar)
  const reopened = parseProjectJson(serializeProject(project))
  assert.deepEqual(
    reopened.sections.find((section) => section.id === navbar.id).properties
      .links,
    navbar.properties.links,
  )

  navbar.properties.links[0].href = 'javascript:alert(1)'
  assert.throws(
    () => parseProjectJson(serializeProject(project)),
    /lien Navbar/,
  )
  navbar.properties.links[0].href = '/'
  navbar.properties.links[0].label = '  '
  assert.throws(
    () => parseProjectJson(serializeProject(project)),
    /lien Navbar/,
  )

  const legacy = structuredClone(project)
  delete legacy.sections.find((section) => section.id === navbar.id).properties
    .links
  assert.deepEqual(
    parseProjectJson(serializeProject(legacy)).sections.find(
      (section) => section.id === navbar.id,
    ).properties.links,
    [],
  )
})
