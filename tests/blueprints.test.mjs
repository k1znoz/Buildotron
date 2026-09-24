import assert from 'node:assert/strict'
import { test } from 'node:test'
import { blueprintIds, blueprints } from '../blueprints/index.ts'
import { createProjectFromBlueprint } from '../Apps/builder/src/project.ts'
import {
  parseProjectJson,
  serializeProject,
} from '../Apps/builder/src/projectJson.ts'

test('the Blueprint registry exposes three distinct starting structures', () => {
  assert.deepEqual(blueprintIds, [
    'product-landing',
    'coming-soon',
    'portfolio',
  ])
  assert.deepEqual(
    blueprints['product-landing'].sections.map(({ type }) => type),
    ['Hero', 'Features', 'CTA'],
  )
  assert.deepEqual(
    blueprints['coming-soon'].sections.map(({ type }) => type),
    ['Hero', 'CTA', 'Footer'],
  )
  assert.deepEqual(
    blueprints.portfolio.sections.map(({ type }) => type),
    ['Navbar', 'Hero', 'Gallery', 'Footer'],
  )
})

test('a Blueprint creates an independent canonical project that reopens', () => {
  for (const id of blueprintIds) {
    const project = createProjectFromBlueprint(id, 'Projet de test', 'id-' + id)
    assert.equal(project.blueprint, id)
    assert.deepEqual(
      project.sections.map((section) => section.type),
      blueprints[id].sections.map((section) => section.type),
    )
    assert.equal(
      new Set(project.sections.map((section) => section.id)).size,
      project.sections.length,
    )
    assert.deepEqual(parseProjectJson(serializeProject(project)), project)
  }
})

test('Blueprint content is specific and independent between projects', () => {
  const first = createProjectFromBlueprint('portfolio')
  const second = createProjectFromBlueprint('portfolio')

  assert.equal(first.sections[0].properties.title, 'Portfolio')
  assert.deepEqual(first.sections[0].properties.links, [
    { label: 'Projects', href: '#projects' },
  ])

  first.sections[0].properties.title = 'Changed title'
  first.sections[0].properties.links[0].label = 'Changed link'

  assert.equal(second.sections[0].properties.title, 'Portfolio')
  assert.equal(second.sections[0].properties.links[0].label, 'Projects')
  assert.equal(
    blueprints.portfolio.sections[0].properties.links[0].label,
    'Projects',
  )
})
