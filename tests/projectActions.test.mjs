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
