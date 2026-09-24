import { useState } from 'react'
import { Button } from '@buildotron/design-system'
import { validateGalleryContent } from './galleryContent'
import type { GalleryContent } from './galleryContent'

type Props = {
  initialContent: GalleryContent
  onApply: (content: GalleryContent) => void
}

export function GalleryAdminForm({ initialContent, onApply }: Props) {
  const [draft, setDraft] = useState<GalleryContent>(initialContent)
  const [error, setError] = useState('')

  function changeText(key: 'title' | 'body', value: string) {
    setDraft((current) => ({ ...current, [key]: value }))
    setError('')
  }

  function changeImage(index: number, key: 'src' | 'alt', value: string) {
    setDraft((current) => ({
      ...current,
      images: current.images.map((image, position) =>
        position === index ? { ...image, [key]: value } : image,
      ),
    }))
    setError('')
  }

  return (
    <form
      className="admin-form"
      onSubmit={(event) => {
        event.preventDefault()
        const issue = validateGalleryContent(draft)
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
        <h3>Images</h3>
        {draft.images.map((image, index) => (
          <fieldset className="admin-form__item" key={index}>
            <legend>Image {index + 1}</legend>
            <label className="admin-form__field">
              <span>URL ou chemin</span>
              <input
                value={image.src}
                placeholder="https://exemple.fr/photo.jpg ou /photo.jpg"
                onChange={(event) =>
                  changeImage(index, 'src', event.target.value)
                }
              />
            </label>
            <label className="admin-form__field">
              <span>Texte alternatif</span>
              <input
                value={image.alt}
                onChange={(event) =>
                  changeImage(index, 'alt', event.target.value)
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
