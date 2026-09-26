export type SpecificationsContent = {
  title: string
  body: string
  specifications: { label: string; value: string }[]
}

export function validateSpecificationsContent(
  content: SpecificationsContent,
): string | null {
  if (!content.title.trim() || !content.body.trim()) {
    return 'Le titre et le texte de la section sont obligatoires.'
  }
  if (content.specifications.length < 1 || content.specifications.length > 20) {
    return 'La section doit contenir entre 1 et 20 caractéristiques.'
  }
  if (
    content.specifications.some(
      (item) => !item.label.trim() || !item.value.trim(),
    )
  ) {
    return 'Chaque caractéristique doit avoir un libellé et une valeur.'
  }
  return null
}
