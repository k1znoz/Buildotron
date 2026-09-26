import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import {
  createSection,
  defaultSlot,
  sectionTypes,
} from '../Apps/builder/src/project.ts'
import { parseProjectJson } from '../Apps/builder/src/projectJson.ts'
import { pluginCatalog } from '@buildotron/plugins/catalog'

const project = parseProjectJson(
  readFileSync(
    new URL('../projects/product-landing.json', import.meta.url),
    'utf8',
  ),
)

test('Section plugin metadata matches the canonical project model', () => {
  const hero = project.sections.find((section) => section.type === 'Hero')
  assert.ok(hero)
  assert.deepEqual(
    sectionTypes,
    pluginCatalog.map((plugin) => plugin.manifest.name),
  )
  for (const type of sectionTypes) {
    const manifest = JSON.parse(
      readFileSync(
        new URL(`../plugins/${type}.plugin/manifest.json`, import.meta.url),
        'utf8',
      ),
    )
    const schema = JSON.parse(
      readFileSync(
        new URL(`../plugins/${type}.plugin/schema.json`, import.meta.url),
        'utf8',
      ),
    )
    const previewImage = readFileSync(
      new URL(`../plugins/${type}.plugin/preview.svg`, import.meta.url),
      'utf8',
    )
    assert.match(previewImage, /<svg\b/)
    assert.equal(manifest.id, type.toLowerCase())
    assert.equal(manifest.defaultSlot, defaultSlot[type])
    assert.ok(manifest.supports.includes('react'))
    assert.deepEqual(
      schema.fields.map((field) => field.name),
      Object.keys(createSection(type).properties),
    )
    assert.ok(
      schema.fields.every((field) => typeof field.required === 'boolean'),
    )
    assert.ok(
      schema.fields
        .filter((field) => field.name !== 'actionHref')
        .every((field) => field.required),
    )
    if (type === 'CTA' || type === 'Hero')
      assert.equal(
        schema.fields.find((field) => field.name === 'actionHref').required,
        false,
      )
  }
  assert.equal(hero.slot, defaultSlot.Hero)
})
