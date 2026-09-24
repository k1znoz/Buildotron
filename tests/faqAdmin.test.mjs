import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateFAQContent } from '../plugins/FAQ.plugin/admin/faqContent.ts'

const valid = {
  title: 'Questions fréquentes',
  body: 'Les réponses essentielles.',
  questions: [
    { question: 'Comment commencer ?', answer: 'Ouvrez le Builder.' },
  ],
}

test('FAQ admin accepts complete questions and answers', () => {
  assert.equal(validateFAQContent(valid), null)
})

test('FAQ admin rejects missing section text, empty lists and incomplete answers', () => {
  assert.match(
    validateFAQContent({ ...valid, title: ' ' }),
    /section sont obligatoires/,
  )
  assert.match(validateFAQContent({ ...valid, questions: [] }), /entre 1 et 12/)
  assert.match(
    validateFAQContent({
      ...valid,
      questions: [{ question: 'Quand ?', answer: ' ' }],
    }),
    /réponse/,
  )
  assert.match(
    validateFAQContent({
      ...valid,
      questions: [{ question: '', answer: 'Maintenant.' }],
    }),
    /réponse/,
  )
})
