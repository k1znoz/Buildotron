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
  const archive = await createProjectArchive(project, {
    '/assets/test.png': new Blob(['image']),
  })
  const zip = await JSZip.loadAsync(await archive.arrayBuffer())

  assert.equal(projectArchiveName(project), 'projet-demo.zip')
  assert.ok(zip.file('package.json'))
  assert.ok(zip.file('.gitignore'))
  assert.ok(zip.file('src/App.tsx'))
  assert.ok(zip.file('src/sections.tsx'))
  assert.ok(zip.file('src/cms/content.ts'))
  assert.ok(zip.file('server/contentStore.mjs'))
  assert.ok(zip.file('server/index.mjs'))
  assert.ok(zip.file('tests/cms-server.test.mjs'))
  assert.ok(zip.file('tests/content-store.test.mjs'))
  assert.ok(zip.file('public/assets/test.png'))
  const structure = JSON.parse(
    await zip.file('src/structure.json').async('string'),
  )
  const content = JSON.parse(
    await zip.file('src/cms/content.json').async('string'),
  )
  assert.deepEqual(
    structure.sections.map(({ id, type, slot, override }) => ({
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
  assert.deepEqual(
    content.sections.map((section) => section.content),
    project.sections.map((section) => section.properties),
  )
})
