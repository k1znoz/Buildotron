import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createSection } from '../Apps/builder/src/project.ts'
import {
  parseProjectJson,
  serializeProject,
} from '../Apps/builder/src/projectJson.ts'
import { validateSpecificationsContent } from '../plugins/Specifications.plugin/admin/specificationsContent.ts'

test('Specifications preserves structured labels and values', () => {
  const section = createSection('Specifications')
  assert.equal(section.properties.specifications.length, 3)
  assert.equal(validateSpecificationsContent(section.properties), null)

  const project = {
    formatVersion: 1,
    id: 'specifications-test',
    name: 'Specifications test',
    blueprint: 'product-landing',
    theme: 'minimal',
    sections: [section],
  }
  const reopened = parseProjectJson(serializeProject(project))
  assert.deepEqual(
    reopened.sections[0].properties.specifications,
    section.properties.specifications,
  )
  assert.match(
    validateSpecificationsContent({
      title: 'Caractéristiques',
      body: 'Détails',
      specifications: [{ label: 'Poids', value: '' }],
    }),
    /libellé et une valeur/,
  )
})
