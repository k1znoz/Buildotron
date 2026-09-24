import { isSafeImageSrc } from '@buildotron/plugin-sdk'

export type GalleryContent = {
  title: string
  body: string
  images: { src: string; alt: string }[]
}

export function validateGalleryContent(content: GalleryContent): string | null {
  if (!content.title.trim() || !content.body.trim()) {
    return 'Le titre et le texte de la section sont obligatoires.'
  }
  if (content.images.length < 1 || content.images.length > 12) {
    return 'La galerie doit contenir entre 1 et 12 images.'
  }
  for (const image of content.images) {
    if (!isSafeImageSrc(image.src)) {
      return 'Chaque image doit avoir une URL http(s) ou un chemin /... valide.'
    }
    if (!image.alt.trim()) {
      return 'Chaque image doit avoir un texte alternatif.'
    }
  }
  return null
}
