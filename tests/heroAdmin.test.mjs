import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateHeroContent } from '../plugins/Hero.plugin/admin/heroContent.ts'

const valid = {
  title: 'Bienvenue',
  body: 'Découvrez notre produit.',
  actionLabel: 'En savoir plus',
  actionHref: '/details',
}

test('Hero admin accepts complete content and an optional action', () => {
  assert.equal(validateHeroContent(valid), null)
  assert.equal(
    validateHeroContent({ ...valid, actionLabel: '', actionHref: '' }),
    null,
  )
})

test('Hero admin rejects missing text and incomplete or unsafe actions', () => {
  assert.match(
    validateHeroContent({ ...valid, title: ' ' }),
    /titre et le texte/,
  )
  assert.match(validateHeroContent({ ...valid, body: '' }), /titre et le texte/)
  assert.match(validateHeroContent({ ...valid, actionLabel: '' }), /libellé/)
  assert.match(
    validateHeroContent({ ...valid, actionHref: 'javascript:alert(1)' }),
    /lien/,
  )
})
