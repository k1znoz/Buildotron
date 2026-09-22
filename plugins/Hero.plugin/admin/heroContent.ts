import { isSafeHref } from '@buildotron/plugin-sdk'

export type HeroContent = {
  title: string
  body: string
  actionLabel: string
  actionHref: string
}

export function validateHeroContent(content: HeroContent): string | null {
  if (!content.title.trim() || !content.body.trim()) {
    return 'Le titre et le texte sont obligatoires.'
  }
  if (content.actionHref && !isSafeHref(content.actionHref)) {
    return 'Le lien doit être une URL http(s), un chemin /... ou une ancre #...'
  }
  if (content.actionHref && !content.actionLabel.trim()) {
    return 'Ajoutez un libellé pour le lien du bouton.'
  }
  return null
}
