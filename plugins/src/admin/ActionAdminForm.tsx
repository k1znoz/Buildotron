import { useState } from 'react'
import { Button } from '@buildotron/design-system'
import { validateActionContent } from './actionContent'
import type { ActionContent } from './actionContent'

type Props = {
  initialContent: ActionContent
  onApply: (content: ActionContent) => void
  requiredAction: boolean
}

export function ActionAdminForm({
  initialContent,
  onApply,
  requiredAction,
}: Props) {
  const [draft, setDraft] = useState<ActionContent>(initialContent)
  const [error, setError] = useState('')

  function change(key: keyof ActionContent, value: string) {
    setDraft((current) => ({ ...current, [key]: value }))
    setError('')
  }

  return (
    <form
      className="admin-form"
      onSubmit={(event) => {
        event.preventDefault()
        const issue = validateActionContent(draft, requiredAction)
        if (issue) {
          setError(issue)
          return
        }
        onApply(draft)
      }}
    >
      <label className="admin-form__field">
        <span>Titre</span>
        <input
          value={draft.title}
          onChange={(event) => change('title', event.target.value)}
        />
      </label>
      <label className="admin-form__field">
        <span>Texte</span>
        <textarea
          rows={4}
          value={draft.body}
          onChange={(event) => change('body', event.target.value)}
        />
      </label>
      <label className="admin-form__field">
        <span>Libellé du bouton</span>
        <input
          value={draft.actionLabel}
          onChange={(event) => change('actionLabel', event.target.value)}
        />
      </label>
      <label className="admin-form__field">
        <span>Lien du bouton</span>
        <input
          value={draft.actionHref}
          placeholder="https://exemple.fr, /contact ou #contact"
          onChange={(event) => change('actionHref', event.target.value)}
        />
      </label>
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
