import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateNavbarContent } from '../plugins/Navbar.plugin/admin/navbarContent.ts'

const valid = {
  title: 'Navigation',
  body: 'Liens principaux.',
  links: [
    { label: 'Accueil', href: '/' },
    { label: 'Services', href: '#services' },
  ],
}

test('Navbar admin accepts complete, safe links', () => {
  assert.equal(validateNavbarContent(valid), null)
})

test('Navbar admin rejects missing text, missing links and invalid destinations', () => {
  assert.match(
    validateNavbarContent({ ...valid, title: ' ' }),
    /section sont obligatoires/,
  )
  assert.match(validateNavbarContent({ ...valid, links: [] }), /entre 1 et 12/)
  assert.match(
    validateNavbarContent({
      ...valid,
      links: [{ label: '', href: '/' }],
    }),
    /libellé/,
  )
  assert.match(
    validateNavbarContent({
      ...valid,
      links: [{ label: 'Accueil', href: 'data:text/html,test' }],
    }),
    /URL/,
  )
})
