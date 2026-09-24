import { isSafeHref } from '@buildotron/plugin-sdk'

export type LinksContent = {
  title: string
  body: string
  links: { label: string; href: string }[]
}

export function validateLinksContent(
  content: LinksContent,
  sectionName: string,
): string | null {
  if (!content.title.trim() || !content.body.trim()) {
    return 'Le titre et le texte de la section sont obligatoires.'
  }
  if (content.links.length < 1 || content.links.length > 12) {
    return `${sectionName} doit contenir entre 1 et 12 liens.`
  }
  for (const link of content.links) {
    if (!link.label.trim()) {
      return 'Chaque lien doit avoir un libellé.'
    }
    if (!isSafeHref(link.href)) {
      return 'Chaque lien doit avoir une URL http(s), un chemin /... ou une ancre #...'
    }
  }
  return null
}
