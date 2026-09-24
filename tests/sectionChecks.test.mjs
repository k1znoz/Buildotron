import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { checkSectionsForExport } from '../Apps/builder/src/sectionChecks.ts'
import { createSection } from '../Apps/builder/src/project.ts'
import { parseProjectJson } from '../Apps/builder/src/projectJson.ts'

const sample = readFileSync(
  new URL('../projects/product-landing.json', import.meta.url),
  'utf8',
)

test('section check reports plugin blockers and clears them as content is fixed', () => {
  const project = parseProjectJson(sample)
  project.sections.find(
    (section) => section.type === 'CTA',
  ).properties.actionHref = ''
  assert.match(checkSectionsForExport(project)[0].message, /lien du bouton/)

  project.sections.find(
    (section) => section.type === 'CTA',
  ).properties.actionHref = '/contact'
  assert.deepEqual(checkSectionsForExport(project), [])

  project.sections.push(
    createSection('Navbar'),
    createSection('Gallery'),
    createSection('FAQ'),
    createSection('Footer'),
  )
  const initialIssues = checkSectionsForExport(project)
  assert.equal(initialIssues.length, 3)
  assert.match(initialIssues[0].message, /Navbar.*entre 1 et 12 liens/)
  assert.match(initialIssues[1].message, /Gallery.*entre 1 et 12 images/)
  assert.match(initialIssues[2].message, /Footer.*entre 1 et 12 liens/)

  project.sections.find(
    (section) => section.type === 'Gallery',
  ).properties.images = [{ src: '/gallery-validation.svg', alt: 'Motif' }]
  assert.equal(checkSectionsForExport(project).length, 2)
  project.sections.find(
    (section) => section.type === 'Navbar',
  ).properties.links = [{ label: 'Accueil', href: '/' }]
  assert.equal(checkSectionsForExport(project).length, 1)
  project.sections.find(
    (section) => section.type === 'Footer',
  ).properties.links = [{ label: 'Mentions légales', href: '/legal' }]
  assert.deepEqual(checkSectionsForExport(project), [])
})

test('section check delegates every plugin to its export validator', () => {
  const project = parseProjectJson(sample)
  project.sections.find(
    (section) => section.type === 'CTA',
  ).properties.actionHref = '/contact'
  project.sections.push(
    createSection('Gallery'),
    createSection('FAQ'),
    createSection('Footer'),
    createSection('Navbar'),
  )
  project.sections.find(
    (section) => section.type === 'Gallery',
  ).properties.images = [{ src: '/gallery-validation.svg', alt: 'Motif' }]
  project.sections.find(
    (section) => section.type === 'Footer',
  ).properties.links = [{ label: 'Legal', href: '/legal' }]
  project.sections.find(
    (section) => section.type === 'Navbar',
  ).properties.links = [{ label: 'Accueil', href: '/' }]

  assert.deepEqual(checkSectionsForExport(project), [])
})

test('section check includes canonical JSON errors and an empty project', () => {
  const project = parseProjectJson(sample)
  project.sections[0].properties.title = ' '
  assert.match(checkSectionsForExport(project)[0].message, /obligatoires/)

  project.sections = []
  assert.match(
    checkSectionsForExport(project)[0].message,
    /au moins une section/,
  )
})
