import { useState } from 'react'
import { Button } from '@buildotron/design-system'
import { validateFeaturesContent } from './featuresContent'
import type { FeaturesContent } from './featuresContent'

type Props = {
  initialContent: FeaturesContent
  onApply: (content: FeaturesContent) => void
}

export function FeaturesAdminForm({ initialContent, onApply }: Props) {
  const [draft, setDraft] = useState<FeaturesContent>(initialContent)
  const [error, setError] = useState('')

  function changeText(key: 'title' | 'body', value: string) {
    setDraft((current) => ({ ...current, [key]: value }))
    setError('')
  }

  function changeItem(index: number, key: 'title' | 'body', value: string) {
    setDraft((current) => ({
      ...current,
      items: current.items.map((item, position) =>
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
        const issue = validateFeaturesContent(draft)
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
        <h3>Éléments</h3>
        {draft.items.map((item, index) => (
          <fieldset className="admin-form__item" key={index}>
            <legend>Élément {index + 1}</legend>
            <label className="admin-form__field">
              <span>Titre</span>
              <input
                value={item.title}
                onChange={(event) =>
                  changeItem(index, 'title', event.target.value)
                }
              />
            </label>
            <label className="admin-form__field">
              <span>Texte</span>
              <textarea
                rows={2}
                value={item.body}
                onChange={(event) =>
                  changeItem(index, 'body', event.target.value)
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
