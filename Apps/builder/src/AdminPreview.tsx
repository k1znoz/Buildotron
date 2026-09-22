import { useState } from 'react'
import { Hero, HeroAdminForm } from '@buildotron/plugins'
import type { HeroContent } from '@buildotron/plugins'
import './AdminPreview.css'

const initialContent: HeroContent = {
  title: 'A clear starting point for your product.',
  body: 'A structural preview of the selected Blueprint.',
  actionLabel: 'Learn more',
  actionHref: '',
}

export function AdminPreview() {
  const [content, setContent] = useState(initialContent)
  const [applied, setApplied] = useState(false)

  return (
    <main className="admin-preview">
      <header className="admin-preview__header">
        <div>
          <p className="admin-preview__eyebrow">
            Buildotron · test de composant
          </p>
          <h1>Formulaire de contenu Hero</h1>
          <p>
            Aperçu isolé du futur formulaire CMS. Les modifications restent en
            mémoire dans cette page.
          </p>
        </div>
        <a href="/">Retour au Builder</a>
      </header>
      <div className="admin-preview__layout">
        <section className="admin-preview__panel" aria-labelledby="form-title">
          <h2 id="form-title">Contenu</h2>
          <HeroAdminForm
            initialContent={initialContent}
            onApply={(next) => {
              setContent(next)
              setApplied(true)
            }}
          />
          <p role="status">
            {applied ? "Modifications appliquées à l'aperçu." : ''}
          </p>
        </section>
        <section
          className="admin-preview__panel"
          aria-labelledby="preview-title"
        >
          <h2 id="preview-title">Aperçu React</h2>
          <Hero {...content} preview />
        </section>
      </div>
    </main>
  )
}
