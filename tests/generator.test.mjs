import assert from 'node:assert/strict'
import { test } from 'node:test'
import { generateReactProject } from '../packages/generator/src/index.ts'

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
    'src/styles.css',
    'tsconfig.json',
    'vite.config.ts',
  ])
  assert.equal(JSON.parse(files['package.json']).name, 'mon-projet-demo')
  assert.deepEqual(JSON.parse(files['src/content.json']), project)
  assert.match(files['src/App.tsx'], /project\.sections\.map/)
  assert.match(files['README.md'], /npm run build/)
})

test('Handlebars escapes the project name inserted into generated source', () => {
  const files = generateReactProject({ ...project, name: '<script>alert(1)</script>' })
  assert.doesNotMatch(files['src/App.tsx'], /<script>/)
  assert.match(files['src/App.tsx'], /&lt;script&gt;/)
})
