import { defaultSlot, slotLabels, slots } from '../project'
import type { SectionInstance, Slot } from '../project'
import { Button } from '@buildotron/design-system'

type Props = {
  projectName: string
  section: SectionInstance | null
  onName: (name: string) => void
  onProperty: (
    key: 'title' | 'body' | 'actionLabel' | 'actionHref',
    value: string,
  ) => void
  onFeatureItem: (index: number, key: 'title' | 'body', value: string) => void
  onAddFeatureItem: () => void
  onRemoveFeatureItem: (index: number) => void
  onGalleryImage: (index: number, key: 'src' | 'alt', value: string) => void
  onAddGalleryImage: () => void
  onRemoveGalleryImage: (index: number) => void
  onFAQItem: (index: number, key: 'question' | 'answer', value: string) => void
  onAddFAQItem: () => void
  onRemoveFAQItem: (index: number) => void
  onFooterLink: (index: number, key: 'label' | 'href', value: string) => void
  onAddFooterLink: () => void
  onRemoveFooterLink: (index: number) => void
  onDuplicate: () => void
  onRemove: () => void
  onMove: (id: string, slot: Slot) => void
  onMoveBy: (offset: number) => void
  onOverride: (enabled: boolean) => void
}

export function Inspector({
  projectName,
  section,
  onName,
  onProperty,
  onFeatureItem,
  onAddFeatureItem,
  onRemoveFeatureItem,
  onGalleryImage,
  onAddGalleryImage,
  onRemoveGalleryImage,
  onFAQItem,
  onAddFAQItem,
  onRemoveFAQItem,
  onFooterLink,
  onAddFooterLink,
  onRemoveFooterLink,
  onDuplicate,
  onRemove,
  onMove,
  onMoveBy,
  onOverride,
}: Props) {
  return (
    <aside className="panel panel--inspector" aria-labelledby="inspector-title">
      <h2 className="panel__heading" id="inspector-title">
        Inspector
      </h2>
      <section className="inspector-section">
        <h3 className="inspector-section__title">Page</h3>
        <label className="field">
          <span className="field__label">Nom du projet</span>
          <input
            className="field__value"
            value={projectName}
            onChange={(event) => onName(event.target.value)}
          />
        </label>
        <div className="field">
          <span className="field__label">Blueprint</span>
          <span className="field__value">Product Landing</span>
        </div>
        <div className="field">
          <span className="field__label">Theme</span>
          <span className="field__value">Minimal</span>
        </div>
      </section>
      <section className="inspector-section">
        <h3 className="inspector-section__title">Selection</h3>
        {section ? (
          <>
            <div className="field">
              <span className="field__label">Section</span>
              <span className="field__value">{section.type}</span>
            </div>
            <label className="field">
              <span className="field__label">Titre</span>
              <input
                className="field__value"
                value={section.properties.title}
                onChange={(event) => onProperty('title', event.target.value)}
              />
            </label>
            <label className="field">
              <span className="field__label">Texte</span>
              <textarea
                className="field__value"
                rows={3}
                value={section.properties.body}
                onChange={(event) => onProperty('body', event.target.value)}
              />
            </label>
            {(section.type === 'CTA' || section.type === 'Hero') && (
              <>
                <label className="field">
                  <span className="field__label">Libellé du bouton</span>
                  <input
                    className="field__value"
                    value={section.properties.actionLabel ?? ''}
                    onChange={(event) =>
                      onProperty('actionLabel', event.target.value)
                    }
                  />
                </label>
                <label className="field">
                  <span className="field__label">Lien du bouton</span>
                  <input
                    className="field__value"
                    value={section.properties.actionHref ?? ''}
                    onChange={(event) =>
                      onProperty('actionHref', event.target.value)
                    }
                    placeholder="https://exemple.fr, /contact ou #contact"
                  />
                </label>
                <p className="inspector-note">
                  {section.type === 'CTA'
                    ? "Le CTA reste désactivé tant qu'aucun lien valide n'est renseigné."
                    : "L'action du Hero apparaît dès qu'un lien valide est renseigné."}
                </p>
              </>
            )}
            {section.type === 'Features' && (
              <div className="feature-editor">
                <h4>Éléments</h4>
                {(section.properties.items ?? []).map((item, index) => (
                  <fieldset key={index} className="feature-editor__item">
                    <legend>Élément {index + 1}</legend>
                    <label className="field">
                      <span className="field__label">Titre</span>
                      <input
                        className="field__value"
                        value={item.title}
                        onChange={(event) =>
                          onFeatureItem(index, 'title', event.target.value)
                        }
                      />
                    </label>
                    <label className="field">
                      <span className="field__label">Texte</span>
                      <textarea
                        className="field__value"
                        rows={2}
                        value={item.body}
                        onChange={(event) =>
                          onFeatureItem(index, 'body', event.target.value)
                        }
                      />
                    </label>
                    <Button
                      onClick={() => onRemoveFeatureItem(index)}
                      disabled={section.properties.items?.length === 1}
                    >
                      Retirer cet élément
                    </Button>
                  </fieldset>
                ))}
                <Button
                  onClick={onAddFeatureItem}
                  disabled={(section.properties.items?.length ?? 0) >= 12}
                >
                  Ajouter un élément
                </Button>
              </div>
            )}
            {section.type === 'Gallery' && (
              <div className="feature-editor">
                <h4>Images</h4>
                {(section.properties.images ?? []).map((image, index) => (
                  <fieldset key={index} className="feature-editor__item">
                    <legend>Image {index + 1}</legend>
                    <label className="field">
                      <span className="field__label">URL ou chemin</span>
                      <input
                        className="field__value"
                        value={image.src}
                        onChange={(event) =>
                          onGalleryImage(index, 'src', event.target.value)
                        }
                        placeholder="https://exemple.fr/photo.jpg ou /photo.jpg"
                      />
                    </label>
                    <label className="field">
                      <span className="field__label">Texte alternatif</span>
                      <input
                        className="field__value"
                        value={image.alt}
                        onChange={(event) =>
                          onGalleryImage(index, 'alt', event.target.value)
                        }
                      />
                    </label>
                    <Button onClick={() => onRemoveGalleryImage(index)}>
                      Retirer cette image
                    </Button>
                  </fieldset>
                ))}
                <Button
                  onClick={onAddGalleryImage}
                  disabled={(section.properties.images?.length ?? 0) >= 12}
                >
                  Ajouter une image
                </Button>
              </div>
            )}
            {section.type === 'FAQ' && (
              <div className="feature-editor">
                <h4>Questions</h4>
                {(section.properties.questions ?? []).map((item, index) => (
                  <fieldset key={index} className="feature-editor__item">
                    <legend>Question {index + 1}</legend>
                    <label className="field">
                      <span className="field__label">Question</span>
                      <input
                        className="field__value"
                        value={item.question}
                        onChange={(event) =>
                          onFAQItem(index, 'question', event.target.value)
                        }
                      />
                    </label>
                    <label className="field">
                      <span className="field__label">Réponse</span>
                      <textarea
                        className="field__value"
                        rows={3}
                        value={item.answer}
                        onChange={(event) =>
                          onFAQItem(index, 'answer', event.target.value)
                        }
                      />
                    </label>
                    <Button
                      onClick={() => onRemoveFAQItem(index)}
                      disabled={section.properties.questions?.length === 1}
                    >
                      Retirer cette question
                    </Button>
                  </fieldset>
                ))}
                <Button
                  onClick={onAddFAQItem}
                  disabled={(section.properties.questions?.length ?? 0) >= 12}
                >
                  Ajouter une question
                </Button>
              </div>
            )}
            {(section.type === 'Footer' || section.type === 'Navbar') && (
              <div className="feature-editor">
                <h4>Liens</h4>
                {(section.properties.links ?? []).map((link, index) => (
                  <fieldset key={index} className="feature-editor__item">
                    <legend>Lien {index + 1}</legend>
                    <label className="field">
                      <span className="field__label">Libellé</span>
                      <input
                        className="field__value"
                        value={link.label}
                        onChange={(event) =>
                          onFooterLink(index, 'label', event.target.value)
                        }
                      />
                    </label>
                    <label className="field">
                      <span className="field__label">URL ou chemin</span>
                      <input
                        className="field__value"
                        value={link.href}
                        onChange={(event) =>
                          onFooterLink(index, 'href', event.target.value)
                        }
                        placeholder="https://exemple.fr, /legal ou #contact"
                      />
                    </label>
                    <Button onClick={() => onRemoveFooterLink(index)}>
                      Retirer ce lien
                    </Button>
                  </fieldset>
                ))}
                <Button
                  onClick={onAddFooterLink}
                  disabled={(section.properties.links?.length ?? 0) >= 12}
                >
                  Ajouter un lien
                </Button>
              </div>
            )}
            <label className="field">
              <span className="field__label">Slot</span>
              <select
                className="field__value"
                value={section.slot}
                onChange={(event) =>
                  onMove(section.id, event.target.value as Slot)
                }
              >
                {slots.map((slot) => (
                  <option
                    key={slot}
                    value={slot}
                    disabled={
                      !section.override && slot !== defaultSlot[section.type]
                    }
                  >
                    {slotLabels[slot]}
                  </option>
                ))}
              </select>
            </label>
            <label className="inspector-override">
              <input
                type="checkbox"
                checked={section.override}
                onChange={(event) => onOverride(event.target.checked)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    onOverride(!section.override)
                  }
                }}
              />{' '}
              Autoriser le placement libre
            </label>
            {section.slot !== defaultSlot[section.type] && (
              <p className="inspector-note">
                Placement hors du slot prévu par le Blueprint.
              </p>
            )}
            <div className="inspector-actions">
              <Button onClick={() => onMoveBy(-1)}>Monter</Button>
              <Button onClick={() => onMoveBy(1)}>Descendre</Button>
              <Button onClick={onDuplicate}>Dupliquer</Button>
              <Button onClick={onRemove}>Supprimer</Button>
            </div>
          </>
        ) : (
          <p className="inspector-note">
            Sélectionnez une section sur le canvas.
          </p>
        )}
      </section>
    </aside>
  )
}
