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
  onFeatureItem: (index: number, key: 'title' | 'body', value: string) => void
  onAddFeatureItem: (item: { title: string; body: string }) => void
  onRemoveFeatureItem: (index: number) => void
  onGalleryImage: (index: number, key: 'src' | 'alt', value: string) => void
  onGalleryFile: (index: number, file: File) => void
  onGalleryFileError: (message: string) => void
  onAddGalleryImage: () => void
  onRemoveGalleryImage: (index: number) => void
  onFAQItem: (index: number, key: 'question' | 'answer', value: string) => void
  onAddFAQItem: (item: { question: string; answer: string }) => void
  onRemoveFAQItem: (index: number) => void
  onFooterLink: (index: number, key: 'label' | 'href', value: string) => void
  onAddFooterLink: (item: { label: string; href: string }) => void
  onRemoveFooterLink: (index: number) => void
  onSpecification: (
    index: number,
    key: 'label' | 'value',
    value: string,
  ) => void
  onAddSpecification: (item: { label: string; value: string }) => void
  onRemoveSpecification: (index: number) => void
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
}: {
  field: PluginListField
  items: Record<string, string>[]
  onChange: (index: number, key: string, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
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
            <label className="field" key={itemField.name}>
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
          ))}
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
  onFeatureItem,
  onAddFeatureItem,
  onRemoveFeatureItem,
  onGalleryImage,
  onGalleryFile,
  onGalleryFileError,
  onAddGalleryImage,
  onRemoveGalleryImage,
  onFAQItem,
  onAddFAQItem,
  onRemoveFAQItem,
  onFooterLink,
  onAddFooterLink,
  onRemoveFooterLink,
  onSpecification,
  onAddSpecification,
  onRemoveSpecification,
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
    if (name === 'items') onFeatureItem(index, key as 'title' | 'body', value)
    else if (name === 'questions')
      onFAQItem(index, key as 'question' | 'answer', value)
    else if (name === 'links')
      onFooterLink(index, key as 'label' | 'href', value)
    else if (name === 'specifications')
      onSpecification(index, key as 'label' | 'value', value)
  }

  function addListItem(field: PluginListField) {
    const item = field.defaultItem
    if (field.name === 'items')
      onAddFeatureItem({ title: item.title ?? '', body: item.body ?? '' })
    else if (field.name === 'questions')
      onAddFAQItem({
        question: item.question ?? '',
        answer: item.answer ?? '',
      })
    else if (field.name === 'links')
      onAddFooterLink({ label: item.label ?? '', href: item.href ?? '' })
    else if (field.name === 'specifications')
      onAddSpecification({ label: item.label ?? '', value: item.value ?? '' })
  }

  function removeListItem(name: string, index: number) {
    if (name === 'items') onRemoveFeatureItem(index)
    else if (name === 'questions') onRemoveFAQItem(index)
    else if (name === 'links') onRemoveFooterLink(index)
    else if (name === 'specifications') onRemoveSpecification(index)
  }

  function importGalleryImage(index: number, file: File) {
    const accepted = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!accepted.includes(file.type)) {
      const message = 'Format acceptÃ© : JPEG, PNG, WebP ou GIF.'
      setImageImportError(message)
      onGalleryFileError(message)
      return
    }
    if (file.size > 5_000_000) {
      const message = 'Lâ€™image doit peser moins de 5 Mo.'
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
                    ? "Le CTA reste dÃ©sactivÃ© tant qu'aucun lien valide n'est renseignÃ©."
                    : "L'action du Hero apparaÃ®t dÃ¨s qu'un lien valide est renseignÃ©."}
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
              />
            ))}{' '}
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
                      <span className="field__label">
                        Ou choisir un fichier
                      </span>
                      <input
                        className="field__value field__file"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (file) void importGalleryImage(index, file)
                        }}
                      />
                    </label>
                    {imageImportError && (
                      <p className="field__error" role="alert">
                        {imageImportError}
                      </p>
                    )}
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
                Placement hors du slot prÃ©vu par le Blueprint.
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
            SÃ©lectionnez une section sur le canvas.
          </p>
        )}
      </section>
    </aside>
  )
}
