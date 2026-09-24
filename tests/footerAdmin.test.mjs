import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateFooterContent } from '../plugins/Footer.plugin/admin/footerContent.ts'

const valid = {
  title: 'Pied de page',
  body: 'Informations utiles.',
  links: [
    { label: 'Mentions légales', href: '/legal' },
    { label: 'Contact', href: '#contact' },
  ],
}

test('Footer admin accepts complete, safe links', () => {
  assert.equal(validateFooterContent(valid), null)
})

test('Footer admin rejects missing text, missing links and invalid destinations', () => {
  assert.match(
    validateFooterContent({ ...valid, body: ' ' }),
    /section sont obligatoires/,
  )
  assert.match(validateFooterContent({ ...valid, links: [] }), /entre 1 et 12/)
  assert.match(
    validateFooterContent({
      ...valid,
      links: [{ label: ' ', href: '/legal' }],
    }),
    /libellé/,
  )
  assert.match(
    validateFooterContent({
      ...valid,
      links: [{ label: 'Legal', href: 'javascript:alert(1)' }],
    }),
    /URL/,
  )
})
