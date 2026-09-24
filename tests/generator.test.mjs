import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  generateReactProject,
  validateProjectForGeneration,
} from '../packages/generator/src/index.ts'

const project = {
  formatVersion: 1,
  id: 'project-id',
  name: 'Mon Projet Démo',
  blueprint: 'product-landing',
  theme: 'minimal',
  sections: [
    {
      id: 'hero-id',
      type: 'Hero',
      slot: 'hero',
      override: false,
      properties: { title: 'Hello', body: 'Generated content.' },
    },
  ],
}

test('the generator creates a self-contained React starter from canonical data', () => {
  const files = generateReactProject(project)

  assert.deepEqual(Object.keys(files).sort(), [
    'README.md',
    'index.html',
    'package.json',
    'src/App.tsx',
    'src/content.json',
    'src/main.tsx',
    'src/sections.tsx',
    'src/styles.css',
    'tsconfig.json',
    'vite.config.ts',
  ])
  assert.equal(JSON.parse(files['package.json']).name, 'mon-projet-demo')
  assert.deepEqual(JSON.parse(files['src/content.json']), project)
  assert.match(files['src/App.tsx'], /project\.sections\.map/)
  for (const type of [
    'Navbar',
    'Hero',
    'Features',
    'Gallery',
    'FAQ',
    'CTA',
    'Footer',
  ]) {
    assert.match(files['src/sections.tsx'], new RegExp(type))
  }
  assert.match(files['README.md'], /npm run build/)
})

test('Handlebars escapes the project name inserted into generated source', () => {
  const files = generateReactProject({
    ...project,
    name: '<script>alert(1)</script>',
  })
  assert.doesNotMatch(files['src/App.tsx'], /<script>/)
  assert.match(files['src/App.tsx'], /&lt;script&gt;/)
})

test('generation preflight rejects unsupported and incomplete sections', () => {
  const issues = validateProjectForGeneration({
    ...project,
    sections: [
      { ...project.sections[0], type: 'Unknown' },
      {
        ...project.sections[0],
        id: 'cta-id',
        type: 'CTA',
        properties: {
          title: 'CTA',
          body: 'Body',
          actionHref: 'data:text/html,test',
        },
      },
    ],
  })

  assert.deepEqual(issues, [
    'Section 1 : type non pris en charge.',
    'Section 2 : action CTA valide requise.',
  ])
})
