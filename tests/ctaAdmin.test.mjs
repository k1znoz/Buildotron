import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateCTAContent } from '../plugins/CTA.plugin/admin/ctaContent.ts'

const valid = {
  title: 'Contactez-nous',
  body: 'Parlons de votre projet.',
  actionLabel: 'Contact',
  actionHref: '/contact',
}

test('CTA admin requires a complete, safe action', () => {
  assert.equal(validateCTAContent(valid), null)
  assert.match(validateCTAContent({ ...valid, actionHref: '' }), /obligatoire/)
  assert.match(validateCTAContent({ ...valid, actionLabel: '' }), /libellé/)
  assert.match(
    validateCTAContent({ ...valid, actionHref: 'javascript:alert(1)' }),
    /lien/,
  )
})

test('CTA admin requires title and body', () => {
  assert.match(
    validateCTAContent({ ...valid, title: ' ' }),
    /titre et le texte/,
  )
  assert.match(validateCTAContent({ ...valid, body: ' ' }), /titre et le texte/)
})
