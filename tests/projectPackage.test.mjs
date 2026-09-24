import assert from 'node:assert/strict'
import { test } from 'node:test'
import JSZip from 'jszip'
import {
  createBuilderProjectArchive,
  openBuilderProject,
  projectPackageName,
} from '../Apps/builder/src/projectPackage.ts'
import { createProjectFromBlueprint } from '../Apps/builder/src/project.ts'

test('a Buildotron package keeps canonical JSON and binary assets together', async () => {
  const project = createProjectFromBlueprint('portfolio', 'Projet Média')
  const gallery = project.sections.find((section) => section.type === 'Gallery')
  gallery.properties.images = [{ src: '/assets/photo.png', alt: 'Photo test' }]
  const blob = await createBuilderProjectArchive(project, {
    '/assets/photo.png': new Blob(['binary image'], { type: 'image/png' }),
  })
  const zip = await JSZip.loadAsync(await blob.arrayBuffer())
  assert.ok(zip.file('project.json'))
  assert.ok(zip.file('assets/photo.png'))
  assert.equal(projectPackageName(project), 'projet-media.buildotron.zip')

  const file = new File([blob], 'projet-media.buildotron.zip')
  const reopened = await openBuilderProject(file)
  assert.equal(reopened.project.name, 'Projet Média')
  assert.equal(reopened.assets['/assets/photo.png'].size, 12)
})
