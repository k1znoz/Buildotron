import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createSection } from '../Apps/builder/src/project.ts'
import {
  parseProjectJson,
  serializeProject,
} from '../Apps/builder/src/projectJson.ts'
import { validateStepsContent } from '../plugins/Steps.plugin/admin/stepsContent.ts'

test('Steps keeps an ordered and editable process in canonical JSON', () => {
  const section = createSection('Steps')
  assert.equal(section.properties.items.length, 3)
  assert.equal(validateStepsContent(section.properties), null)

  const project = {
    formatVersion: 1,
    id: 'steps-test',
    name: 'Steps test',
    blueprint: 'product-landing',
    theme: 'minimal',
    sections: [section],
  }
  const reopened = parseProjectJson(serializeProject(project))
  assert.deepEqual(
    reopened.sections[0].properties.items,
    section.properties.items,
  )
  assert.match(
    validateStepsContent({
      title: 'Processus',
      body: 'Mode d’emploi',
      items: [],
    }),
    /entre 1 et 12 étapes/,
  )
})
