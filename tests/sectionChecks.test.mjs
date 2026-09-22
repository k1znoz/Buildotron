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
  assert.match(checkSectionsForExport(project)[0].message, /lien du bouton/)

  project.sections.find(
    (section) => section.type === 'CTA',
  ).properties.actionHref = '/contact'
  assert.deepEqual(checkSectionsForExport(project), [])

  project.sections.push(createSection('Navbar'), createSection('Gallery'))
  assert.deepEqual(
    checkSectionsForExport(project).map((issue) => issue.message),
    [
      'Section 4 (Navbar) : ajoutez au moins un lien de navigation.',
      'Section 5 (Gallery) : ajoutez au moins une image.',
    ],
  )

  project.sections.find(
    (section) => section.type === 'Gallery',
  ).properties.images = [{ src: '/gallery-validation.svg', alt: 'Motif' }]
  assert.equal(checkSectionsForExport(project).length, 1)
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
