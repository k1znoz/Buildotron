import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  applyContentDocument,
  createContentDocument,
  updateSectionContent,
} from '../packages/core-cms/src/index.ts'
import { createProjectFromBlueprint } from '../Apps/builder/src/project.ts'

test('CMS content updates text without changing project structure', () => {
  const project = createProjectFromBlueprint('product-landing', 'CMS test')
  const document = createContentDocument(project)
  const hero = project.sections.find((section) => section.type === 'Hero')
  const updated = updateSectionContent(document, hero.id, {
    ...hero.properties,
    title: 'Titre modifié par le client',
  })
  const applied = applyContentDocument(project, updated)

  assert.equal(
    applied.sections[0].properties.title,
    'Titre modifié par le client',
  )
  assert.deepEqual(
    applied.sections.map(({ id, type, slot, override }) => ({
      id,
      type,
      slot,
      override,
    })),
    project.sections.map(({ id, type, slot, override }) => ({
      id,
      type,
      slot,
      override,
    })),
  )
  assert.notEqual(applied, project)
  assert.notEqual(applied.sections[0], project.sections[0])
})

test('CMS content cannot add, remove, rename or target another project', () => {
  const project = createProjectFromBlueprint('product-landing')
  const document = createContentDocument(project)

  assert.throws(
    () => applyContentDocument(project, { ...document, projectId: 'other' }),
    /ne correspond pas/,
  )
  assert.throws(
    () =>
      applyContentDocument(project, {
        ...document,
        sections: document.sections.slice(1),
      }),
    /nombre de sections/,
  )

  const renamed = structuredClone(document)
  renamed.sections[0].sectionType = 'Footer'
  assert.throws(() => applyContentDocument(project, renamed), /identité/)
  assert.throws(
    () => updateSectionContent(document, 'unknown', { title: 'Nope' }),
    /inconnue/,
  )
})

test('CMS documents do not share nested content with the Builder project', () => {
  const project = createProjectFromBlueprint('product-landing')
  const document = createContentDocument(project)
  document.sections[1].content.items[0].title = 'CMS draft'

  assert.equal(project.sections[1].properties.items[0].title, 'Fast setup')
})
