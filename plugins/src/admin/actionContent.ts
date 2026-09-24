import { isSafeHref } from '@buildotron/plugin-sdk'

export type ActionContent = {
  title: string
  body: string
  actionLabel: string
  actionHref: string
}

export function validateActionContent(
  content: ActionContent,
  requiredAction: boolean,
): string | null {
  if (!content.title.trim() || !content.body.trim()) {
    return 'Le titre et le texte sont obligatoires.'
  }
  if (requiredAction && !content.actionHref) {
    return 'Le lien du bouton est obligatoire.'
  }
  if (content.actionHref && !isSafeHref(content.actionHref)) {
    return 'Le lien doit être une URL http(s), un chemin /... ou une ancre #...'
  }
  if (content.actionHref && !content.actionLabel.trim()) {
    return 'Ajoutez un libellé pour le lien du bouton.'
  }
  return null
}
