export type FAQContent = {
  title: string
  body: string
  questions: { question: string; answer: string }[]
}

export function validateFAQContent(content: FAQContent): string | null {
  if (!content.title.trim() || !content.body.trim()) {
    return 'Le titre et le texte de la section sont obligatoires.'
  }
  if (content.questions.length < 1 || content.questions.length > 12) {
    return 'La FAQ doit contenir entre 1 et 12 questions.'
  }
  if (
    content.questions.some(
      (item) => !item.question.trim() || !item.answer.trim(),
    )
  ) {
    return 'Chaque question doit avoir une réponse.'
  }
  return null
}
