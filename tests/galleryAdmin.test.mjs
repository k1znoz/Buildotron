import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateGalleryContent } from '../plugins/Gallery.plugin/admin/galleryContent.ts'

const valid = {
  title: 'Galerie',
  body: 'Découvrez nos images.',
  images: [{ src: '/gallery-validation.svg', alt: 'Motif vert' }],
}

test('Gallery admin accepts complete image content', () => {
  assert.equal(validateGalleryContent(valid), null)
})

test('Gallery admin rejects incomplete text, missing images and unsafe sources', () => {
  assert.match(
    validateGalleryContent({ ...valid, title: ' ' }),
    /section sont obligatoires/,
  )
  assert.match(
    validateGalleryContent({ ...valid, images: [] }),
    /entre 1 et 12/,
  )
  assert.match(
    validateGalleryContent({
      ...valid,
      images: [{ src: 'javascript:alert(1)', alt: 'Motif' }],
    }),
    /URL/,
  )
  assert.match(
    validateGalleryContent({
      ...valid,
      images: [{ src: '/gallery-validation.svg', alt: ' ' }],
    }),
    /texte alternatif/,
  )
})
