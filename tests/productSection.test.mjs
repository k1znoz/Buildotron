import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createSection } from '../Apps/builder/src/project.ts'
import { validateProductContent } from '../plugins/Product.plugin/admin/productContent.ts'
import { validateProjectForGeneration } from '../packages/generator/src/index.ts'

test('Product uses the published CMS catalog without duplicating it in JSON', () => {
  const section = createSection('Product')
  assert.deepEqual(Object.keys(section.properties), ['title', 'body'])
  assert.equal(validateProductContent(section.properties), null)
  assert.match(
    validateProductContent({ title: '', body: 'Catalogue' }),
    /obligatoires/,
  )
  assert.deepEqual(
    validateProjectForGeneration({
      formatVersion: 1,
      id: 'product-test',
      name: 'Product test',
      blueprint: 'product-landing',
      theme: 'minimal',
      sections: [section],
    }),
    [],
  )
})
