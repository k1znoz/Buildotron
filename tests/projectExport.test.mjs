import assert from 'node:assert/strict'
import { test } from 'node:test'
import JSZip from 'jszip'
import {
  createProjectArchive,
  projectArchiveName,
} from '../Apps/builder/src/projectExport.ts'
import { createProjectFromBlueprint } from '../Apps/builder/src/project.ts'

test('the Builder creates a named ZIP containing the generated React project', async () => {
  const project = createProjectFromBlueprint('product-landing', 'Projet Démo')
  const archive = await createProjectArchive(project)
  const zip = await JSZip.loadAsync(await archive.arrayBuffer())

  assert.equal(projectArchiveName(project), 'projet-demo.zip')
  assert.ok(zip.file('package.json'))
  assert.ok(zip.file('src/App.tsx'))
  assert.ok(zip.file('src/sections.tsx'))
  assert.deepEqual(
    JSON.parse(await zip.file('src/content.json').async('string')),
    project,
  )
})
