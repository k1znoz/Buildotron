import { defaultSlot, sectionTypes, slots } from './project.ts'
import type {
  Project,
  SectionInstance,
  SectionProperties,
  SectionType,
  Slot,
} from './project.ts'
import { isSafeHref, isSafeImageSrc } from '@buildotron/plugin-sdk'
import type { PluginListField } from '@buildotron/plugin-sdk'
import { pluginCatalog } from '@buildotron/plugins/catalog'
import { blueprintIds } from '../../../blueprints/index.ts'
import type { BlueprintId } from '../../../blueprints/index.ts'

export const maxProjectJsonBytes = 8_000_000

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function nonempty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function listError(label: string, type: SectionType, name: string): Error {
  if (name === 'items')
    return new Error(
      `${label} : renseignez entre 1 et 12 éléments de ${type}, chacun avec un titre et un texte.`,
    )
  if (name === 'images')
    return new Error(
      `${label} : chaque image Gallery doit avoir une URL http(s) ou un chemin /... et un texte alternatif non vide (12 images maximum).`,
    )
  if (name === 'questions')
    return new Error(
      `${label} : renseignez entre 1 et 12 questions FAQ, chacune avec une question et une réponse.`,
    )
  if (name === 'links')
    return new Error(
      `${label} : chaque lien ${type} doit avoir un libellé et une URL http(s), un chemin /... ou une ancre #... (12 liens maximum).`,
    )
  return new Error(
    `${label} : renseignez entre 1 et 20 caractéristiques avec un libellé et une valeur.`,
  )
}

export function parseProjectJson(json: string): Project {
  let value: unknown
  try {
    value = JSON.parse(json)
  } catch {
    throw new Error('Le fichier ne contient pas un JSON valide.')
  }
  if (!record(value)) throw new Error('Le projet doit être un objet JSON.')
  if (value.formatVersion !== 1)
    throw new Error('Version du format non prise en charge (attendue : 1).')
  if (!nonempty(value.id) || !nonempty(value.name))
    throw new Error('Identifiant ou nom du projet manquant.')
  if (
    typeof value.blueprint !== 'string' ||
    !blueprintIds.includes(value.blueprint as BlueprintId) ||
    value.theme !== 'minimal'
  ) {
    throw new Error(
      'Blueprint ou thème non pris en charge par cette version du Builder.',
    )
  }
  if (!Array.isArray(value.sections))
    throw new Error('La liste des sections est invalide.')

  const ids = new Set<string>()
  const sections: SectionInstance[] = value.sections.map((raw, index) => {
    const label = `Section ${index + 1}`
    if (!record(raw) || !nonempty(raw.id) || ids.has(raw.id)) {
      throw new Error(`${label} : identifiant absent ou dupliqué.`)
    }
    ids.add(raw.id)
    if (
      typeof raw.type !== 'string' ||
      !sectionTypes.includes(raw.type as SectionType)
    ) {
      throw new Error(`${label} : type inconnu.`)
    }
    if (typeof raw.slot !== 'string' || !slots.includes(raw.slot as Slot)) {
      throw new Error(`${label} : slot inconnu.`)
    }
    if (typeof raw.override !== 'boolean')
      throw new Error(`${label} : override invalide.`)
    const type = raw.type as SectionType
    const slot = raw.slot as Slot
    if (slot !== defaultSlot[type] && !raw.override) {
      throw new Error(`${label} : placement hors slot sans override.`)
    }
    if (!record(raw.properties))
      throw new Error(`${label} : propriétés invalides.`)
    const definition = pluginCatalog.find(
      (plugin) => plugin.manifest.name === type,
    )
    if (!definition) throw new Error(`${label} : définition de plugin absente.`)
    const properties = {} as SectionProperties
    const manifestDefaults = definition.manifest.defaults as unknown as Record<
      string,
      unknown
    >
    for (const field of definition.schema.fields) {
      if (field.type === 'list') continue
      const rawValue = raw.properties[field.name]
      const defaultValue = manifestDefaults[field.name]
      const fieldValue = rawValue ?? defaultValue
      if (
        typeof fieldValue !== 'string' ||
        (field.required && !fieldValue.trim())
      ) {
        if (field.name === 'title' || field.name === 'body') {
          throw new Error(
            `${label} : le titre et le texte sont obligatoires et ne peuvent pas être vides.`,
          )
        }
        throw new Error(`${label} : le champ ${field.label} est invalide.`)
      }
      if (
        field.type === 'url' &&
        fieldValue.length > 0 &&
        !isSafeHref(fieldValue)
      ) {
        throw new Error(
          `${label} : le lien du ${type} doit être une URL http(s), un chemin /... ou une ancre #..., avec un libellé.`,
        )
      }
      Object.assign(properties, { [field.name]: fieldValue })
    }
    for (const schemaField of definition.schema.fields) {
      if (schemaField.type !== 'list' || !('itemFields' in schemaField))
        continue
      const field = schemaField as unknown as PluginListField
      const rawItems =
        raw.properties[field.name] ?? manifestDefaults[field.name]
      if (
        !Array.isArray(rawItems) ||
        rawItems.length < field.minItems ||
        rawItems.length > field.maxItems
      ) {
        throw listError(label, type, field.name)
      }
      const normalizedItems = rawItems.map((rawItem) => {
        if (!record(rawItem)) throw listError(label, type, field.name)
        const normalizedItem: Record<string, string> = {}
        for (const itemField of field.itemFields) {
          const itemValue = rawItem[itemField.name]
          if (
            typeof itemValue !== 'string' ||
            (itemField.required && !itemValue.trim()) ||
            (itemField.type === 'url' &&
              itemValue.length > 0 &&
              (itemField.asset === 'image'
                ? !isSafeImageSrc(itemValue)
                : !isSafeHref(itemValue)))
          ) {
            throw listError(label, type, field.name)
          }
          normalizedItem[itemField.name] = itemValue
        }
        return normalizedItem
      })
      Object.assign(properties, { [field.name]: normalizedItems })
    }
    return { id: raw.id, type, slot, override: raw.override, properties }
  })

  return {
    formatVersion: 1,
    id: value.id,
    name: value.name,
    blueprint: value.blueprint as BlueprintId,
    theme: 'minimal',
    sections,
  }
}

export function serializeProject(project: Project): string {
  return `${JSON.stringify(project, null, 2)}\n`
}
