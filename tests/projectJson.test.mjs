import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import {
  parseProjectJson,
  serializeProject,
} from '../Apps/builder/src/projectJson.ts'
import { isSafeHref } from '@buildotron/plugin-sdk'

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
