import { useState } from 'react'
import { Button } from '@buildotron/design-system'
import { isSafeHref } from '@buildotron/plugin-sdk'
import { validateLinksContent } from './linksContent'
import type { LinksContent } from './linksContent'

type Props = {
  initialContent: LinksContent
  onApply: (content: LinksContent) => void
  sectionName: string
}

export function LinksAdminForm({
  initialContent,
  onApply,
  sectionName,
}: Props) {
  const [draft, setDraft] = useState<LinksContent>(initialContent)
  const issue = validateLinksContent(draft, sectionName)

  function changeText(key: 'title' | 'body', value: string) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function changeLink(index: number, key: 'label' | 'href', value: string) {
    setDraft((current) => ({
      ...current,
      links: current.links.map((link, position) =>
        position === index ? { ...link, [key]: value } : link,
      ),
    }))
  }

  return (
    <form
      className="admin-form"
      onSubmit={(event) => {
        event.preventDefault()
        if (issue) return
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
        <h3>Liens</h3>
        {draft.links.map((link, index) => (
          <fieldset className="admin-form__item" key={index}>
            <legend>Lien {index + 1}</legend>
            <label className="admin-form__field">
              <span>Libellé</span>
              <input
                value={link.label}
                aria-invalid={!link.label.trim()}
                onChange={(event) =>
                  changeLink(index, 'label', event.target.value)
                }
              />
            </label>
            <label className="admin-form__field">
              <span>URL ou chemin</span>
              <input
                value={link.href}
                aria-invalid={!isSafeHref(link.href)}
                placeholder="https://exemple.fr, /legal ou #contact"
                onChange={(event) =>
                  changeLink(index, 'href', event.target.value)
                }
              />
            </label>
          </fieldset>
        ))}
      </div>
      {issue && (
        <p className="admin-form__error" role="alert">
          {issue}
        </p>
      )}
      <Button type="submit" variant="primary" disabled={Boolean(issue)}>
        Appliquer à l'aperçu
      </Button>
    </form>
  )
}
