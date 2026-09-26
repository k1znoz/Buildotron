export type ProductContent = {
  title: string
  body: string
}

export function validateProductContent(content: ProductContent): string | null {
  if (!content.title.trim() || !content.body.trim()) {
    return 'Le titre et le texte de la section sont obligatoires.'
  }
  return null
}
