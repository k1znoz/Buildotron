export type FeaturesContent = {
  title: string
  body: string
  items: { title: string; body: string }[]
}

export function validateFeaturesContent(
  content: FeaturesContent,
): string | null {
  if (!content.title.trim() || !content.body.trim()) {
    return 'Le titre et le texte de la section sont obligatoires.'
  }
  if (content.items.length < 1 || content.items.length > 12) {
    return 'La section doit contenir entre 1 et 12 éléments.'
  }
  if (content.items.some((item) => !item.title.trim() || !item.body.trim())) {
    return 'Chaque élément doit avoir un titre et un texte.'
  }
  return null
}
