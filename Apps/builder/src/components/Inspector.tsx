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
            {section.type === 'CTA' && (
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
                  Le CTA reste désactivé tant qu'aucun lien valide n'est
                  renseigné.
                </p>
              </>
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
