import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import {
  duplicateSection,
  insertionBeforeId,
  moveSection,
  moveSectionBy,
  setSectionOverride,
} from '../Apps/builder/src/projectActions.ts'
import { parseProjectJson } from '../Apps/builder/src/projectJson.ts'
import { createSection } from '../Apps/builder/src/project.ts'

const project = parseProjectJson(
  readFileSync(
    new URL('../projects/product-landing.json', import.meta.url),
    'utf8',
  ),
)
const [hero, features] = project.sections

test('duplication gives an independent section instance', () => {
  const next = duplicateSection(project, hero.id, 'copy-id')
  assert.equal(next.sections.length, 4)
  assert.equal(next.sections[1].id, 'copy-id')
  assert.notEqual(next.sections[0].properties, next.sections[1].properties)
  assert.equal(project.sections.length, 3)

  const withFeatureCopy = duplicateSection(
    project,
    features.id,
    'features-copy',
  )
  const originalItems = withFeatureCopy.sections.find(
    (section) => section.id === features.id,
  ).properties.items
  const copiedItems = withFeatureCopy.sections.find(
    (section) => section.id === 'features-copy',
  ).properties.items
  assert.notEqual(originalItems, copiedItems)
  assert.notEqual(originalItems[0], copiedItems[0])

  const gallery = createSection('Gallery')
  gallery.properties.images = [{ src: '/gallery-validation.svg', alt: 'Motif' }]
  const withGallery = { ...project, sections: [...project.sections, gallery] }
  const withGalleryCopy = duplicateSection(
    withGallery,
    gallery.id,
    'gallery-copy',
  )
  const copiedImages = withGalleryCopy.sections.find(
    (section) => section.id === 'gallery-copy',
  ).properties.images
  assert.notEqual(gallery.properties.images, copiedImages)
  assert.notEqual(gallery.properties.images[0], copiedImages[0])

  const faq = createSection('FAQ')
  const withFAQ = { ...project, sections: [...project.sections, faq] }
  const withFAQCopy = duplicateSection(withFAQ, faq.id, 'faq-copy')
  const copiedQuestions = withFAQCopy.sections.find(
    (section) => section.id === 'faq-copy',
  ).properties.questions
  assert.notEqual(faq.properties.questions, copiedQuestions)
  assert.notEqual(faq.properties.questions[0], copiedQuestions[0])

  const footer = createSection('Footer')
  footer.properties.links = [{ label: 'Legal', href: '/legal' }]
  const withFooter = { ...project, sections: [...project.sections, footer] }
  const withFooterCopy = duplicateSection(withFooter, footer.id, 'footer-copy')
  const copiedLinks = withFooterCopy.sections.find(
    (section) => section.id === 'footer-copy',
  ).properties.links
  assert.notEqual(footer.properties.links, copiedLinks)
  assert.notEqual(footer.properties.links[0], copiedLinks[0])
})

test('slot override is required for exceptional placement', () => {
  assert.equal(moveSection(project, hero.id, 'content'), null)
  const overridden = setSectionOverride(project, hero.id, true)
  const moved = moveSection(overridden, hero.id, 'content', features.id)
  assert.ok(moved)
  assert.equal(
    moved.sections.find((section) => section.id === hero.id).slot,
    'content',
  )
  assert.deepEqual(
    moved.sections
      .filter((section) => section.slot === 'content')
      .map((section) => section.id),
    [hero.id, features.id],
  )
  const restored = setSectionOverride(moved, hero.id, false)
  assert.equal(
    restored.sections.find((section) => section.id === hero.id).slot,
    'hero',
  )
})

test('keyboard reorder only affects the selected slot', () => {
  const extra = duplicateSection(project, features.id, 'extra-id')
  const moved = moveSectionBy(extra, 'extra-id', -1)
  assert.deepEqual(
    moved.sections
      .filter((section) => section.slot === 'content')
      .map((section) => section.id),
    ['extra-id', features.id],
  )
  assert.equal(moveSectionBy(project, features.id, -1), project)
})

test('dropping onto a section moves both upward and downward', () => {
  const extra = duplicateSection(project, features.id, 'extra-id')
  const downBefore = insertionBeforeId(extra, features.id, 'extra-id', false)
  const down = moveSection(extra, features.id, 'content', downBefore)
  assert.deepEqual(
    down.sections
      .filter((section) => section.slot === 'content')
      .map((section) => section.id),
    ['extra-id', features.id],
  )

  const upBefore = insertionBeforeId(down, features.id, 'extra-id', true)
  const up = moveSection(down, features.id, 'content', upBefore)
  assert.deepEqual(
    up.sections
      .filter((section) => section.slot === 'content')
      .map((section) => section.id),
    [features.id, 'extra-id'],
  )
})
