import { useState } from 'react'
import { defaultSlot, slotLabels, slots } from '../project'
import type { SectionInstance, Slot } from '../project'
import { Button } from '@buildotron/design-system'
import { pluginCatalog } from '@buildotron/plugins/catalog'
import { blueprintIds, blueprints } from '../../../../blueprints/index.ts'
import type { BlueprintId } from '../../../../blueprints/index.ts'
import type { PluginListField } from '@buildotron/plugin-sdk'

type Props = {
  projectName: string
  blueprint: BlueprintId
  section: SectionInstance | null
  onName: (name: string) => void
  onBlueprint: (blueprint: BlueprintId) => void
  onProperty: (
    key: 'title' | 'body' | 'actionLabel' | 'actionHref',
    value: string,
  ) => void
  onListItem: (name: string, index: number, key: string, value: string) => void
  onAddListItem: (name: string, item: Record<string, string>) => void
  onRemoveListItem: (name: string, index: number) => void
  onGalleryFile: (index: number, file: File) => void
  onGalleryFileError: (message: string) => void
  onDuplicate: () => void
  onRemove: () => void
  onMove: (id: string, slot: Slot) => void
  onMoveBy: (offset: number) => void
  onOverride: (enabled: boolean) => void
}

function StructuredListEditor({
  field,
  items,
  onChange,
  onAdd,
  onRemove,
  onFile,
  fileError,
}: {
  field: PluginListField
  items: Record<string, string>[]
  onChange: (index: number, key: string, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
  onFile?: (index: number, file: File) => void
  fileError?: string | null
}) {
  return (
    <div className="feature-editor">
      <h4>{field.label}</h4>
      {items.map((item, index) => (
        <fieldset key={index} className="feature-editor__item">
          <legend>
            {field.itemLabel} {index + 1}
          </legend>
          {field.itemFields.map((itemField) => (
            <div key={itemField.name}>
              <label className="field">
                <span className="field__label">{itemField.label}</span>
                {itemField.type === 'textarea' ? (
                  <textarea
                    className="field__value"
                    rows={2}
                    value={item[itemField.name] ?? ''}
                    required={itemField.required}
                    placeholder={itemField.placeholder}
                    onChange={(event) =>
                      onChange(index, itemField.name, event.target.value)
                    }
                  />
                ) : (
                  <input
                    className="field__value"
                    value={item[itemField.name] ?? ''}
                    required={itemField.required}
                    placeholder={itemField.placeholder}
                    onChange={(event) =>
                      onChange(index, itemField.name, event.target.value)
                    }
                  />
                )}
              </label>
              {itemField.asset === 'image' && onFile && (
                <label className="field">
                  <span className="field__label">Ou choisir un fichier</span>
                  <input
                    className="field__value field__file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) onFile(index, file)
                    }}
                  />
                </label>
              )}
            </div>
          ))}
          {fileError && field.name === 'images' && (
            <p className="field__error" role="alert">
              {fileError}
            </p>
          )}
          <Button
            onClick={() => onRemove(index)}
            disabled={items.length <= field.minItems}
          >
            Retirer {field.itemLabel.toLowerCase()}
          </Button>
        </fieldset>
      ))}
      <Button onClick={onAdd} disabled={items.length >= field.maxItems}>
        {field.addLabel}
      </Button>
    </div>
  )
}

export function Inspector({
  projectName,
  blueprint,
  section,
  onName,
  onBlueprint,
  onProperty,
  onListItem,
  onAddListItem,
  onRemoveListItem,
  onGalleryFile,
  onGalleryFileError,
  onDuplicate,
  onRemove,
  onMove,
  onMoveBy,
  onOverride,
}: Props) {
  const [imageImportError, setImageImportError] = useState<string | null>(null)
  const fields = section
    ? (pluginCatalog.find((plugin) => plugin.manifest.name === section.type)
        ?.schema.fields ?? [])
    : []
  const structuredListFields = fields.filter(
    (field) => field.type === 'list' && 'itemFields' in field,
  ) as unknown as PluginListField[]

  function listItems(name: string): Record<string, string>[] {
    if (!section) return []
    const value = section.properties[name as keyof typeof section.properties]
    return Array.isArray(value) ? (value as Record<string, string>[]) : []
  }

  function changeListItem(
    name: string,
    index: number,
    key: string,
    value: string,
  ) {
    onListItem(name, index, key, value)
  }

  function addListItem(field: PluginListField) {
    onAddListItem(field.name, structuredClone(field.defaultItem))
  }

  function removeListItem(name: string, index: number) {
    onRemoveListItem(name, index)
  }

  function importGalleryImage(index: number, file: File) {
    const accepted = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!accepted.includes(file.type)) {
      const message = 'Format accepté : JPEG, PNG, WebP ou GIF.'
      setImageImportError(message)
      onGalleryFileError(message)
      return
    }
    if (file.size > 5_000_000) {
      const message = 'L’image doit peser moins de 5 Mo.'
      setImageImportError(message)
      onGalleryFileError(message)
      return
    }
    onGalleryFile(index, file)
    setImageImportError(null)
  }

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
        <label className="field">
          <span className="field__label">Blueprint</span>
          <select
            className="field__value"
            value={blueprint}
            onChange={(event) => onBlueprint(event.target.value as BlueprintId)}
          >
            {blueprintIds.map((id) => (
              <option key={id} value={id}>
                {blueprints[id].name}
              </option>
            ))}
          </select>
        </label>
        <p className="inspector-note">
          Changer de Blueprint remplace les sections du projet.
        </p>
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
            {fields
              .filter((field) => field.type !== 'list')
              .map((field) => {
                const key = field.name as
                  | 'title'
                  | 'body'
                  | 'actionLabel'
                  | 'actionHref'
                const value = section.properties[key] ?? ''
                const placeholder =
                  'placeholder' in field ? field.placeholder : undefined
                return (
                  <label className="field" key={field.name}>
                    <span className="field__label">{field.label}</span>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="field__value"
                        rows={3}
                        value={value}
                        required={field.required}
                        placeholder={placeholder}
                        onChange={(event) =>
                          onProperty(key, event.target.value)
                        }
                      />
                    ) : (
                      <input
                        className="field__value"
                        type={field.type === 'url' ? 'text' : field.type}
                        value={value}
                        required={field.required}
                        placeholder={placeholder}
                        onChange={(event) =>
                          onProperty(key, event.target.value)
                        }
                      />
                    )}
                  </label>
                )
              })}
            {(section.type === 'CTA' || section.type === 'Hero') && (
              <>
                <p className="inspector-note">
                  {section.type === 'CTA'
                    ? "Le CTA reste désactivé tant qu'aucun lien valide n'est renseigné."
                    : "L'action du Hero apparaît dès qu'un lien valide est renseigné."}
                </p>
              </>
            )}
            {structuredListFields.map((field) => (
              <StructuredListEditor
                key={field.name}
                field={field}
                items={listItems(field.name)}
                onChange={(index, key, value) =>
                  changeListItem(field.name, index, key, value)
                }
                onAdd={() => addListItem(field)}
                onRemove={(index) => removeListItem(field.name, index)}
                onFile={
                  field.name === 'images'
                    ? (index, file) => importGalleryImage(index, file)
                    : undefined
                }
                fileError={
                  field.name === 'images' ? imageImportError : undefined
                }
              />
            ))}{' '}
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
