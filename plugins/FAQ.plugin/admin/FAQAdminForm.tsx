import { useState } from 'react'
import { Button } from '@buildotron/design-system'
import { validateFAQContent } from './faqContent'
import type { FAQContent } from './faqContent'

type Props = {
  initialContent: FAQContent
  onApply: (content: FAQContent) => void
}

export function FAQAdminForm({ initialContent, onApply }: Props) {
  const [draft, setDraft] = useState<FAQContent>(initialContent)
  const [error, setError] = useState('')

  function changeText(key: 'title' | 'body', value: string) {
    setDraft((current) => ({ ...current, [key]: value }))
    setError('')
  }

  function changeQuestion(
    index: number,
    key: 'question' | 'answer',
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((item, position) =>
        position === index ? { ...item, [key]: value } : item,
      ),
    }))
    setError('')
  }

  return (
    <form
      className="admin-form"
      onSubmit={(event) => {
        event.preventDefault()
        const issue = validateFAQContent(draft)
        if (issue) {
          setError(issue)
          return
        }
        onApply(draft)
      }}
    >
      <label className="admin-form__field">
        <span>Titre de la section</span>
        <input
          value={draft.title}
          onChange={(event) => changeText('title', event.target.value)}
        />
      </label>
      <label className="admin-form__field">
        <span>Texte de la section</span>
        <textarea
          rows={3}
          value={draft.body}
          onChange={(event) => changeText('body', event.target.value)}
        />
      </label>
      <div className="admin-form__items">
        <h3>Questions</h3>
        {draft.questions.map((item, index) => (
          <fieldset className="admin-form__item" key={index}>
            <legend>Question {index + 1}</legend>
            <label className="admin-form__field">
              <span>Question</span>
              <input
                value={item.question}
                onChange={(event) =>
                  changeQuestion(index, 'question', event.target.value)
                }
              />
            </label>
            <label className="admin-form__field">
              <span>Réponse</span>
              <textarea
                rows={3}
                value={item.answer}
                onChange={(event) =>
                  changeQuestion(index, 'answer', event.target.value)
                }
              />
            </label>
          </fieldset>
        ))}
      </div>
      {error && (
        <p className="admin-form__error" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary">
        Appliquer à l'aperçu
      </Button>
    </form>
  )
}
