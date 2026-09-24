import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateFeaturesContent } from '../plugins/Features.plugin/admin/featuresContent.ts'

const valid = {
  title: 'Avantages',
  body: 'Pourquoi choisir ce produit.',
  items: [
    { title: 'Rapide', body: 'Prêt en quelques étapes.' },
    { title: 'Souple', body: 'Adaptable au projet.' },
  ],
}

test('Features admin accepts complete text and cards', () => {
  assert.equal(validateFeaturesContent(valid), null)
})

test('Features admin rejects incomplete fields and empty lists', () => {
  assert.match(
    validateFeaturesContent({ ...valid, title: ' ' }),
    /section sont obligatoires/,
  )
  assert.match(
    validateFeaturesContent({ ...valid, body: '' }),
    /section sont obligatoires/,
  )
  assert.match(
    validateFeaturesContent({ ...valid, items: [] }),
    /entre 1 et 12/,
  )
  assert.match(
    validateFeaturesContent({
      ...valid,
      items: [{ title: ' ', body: 'Texte' }],
    }),
    /Chaque élément/,
  )
})
