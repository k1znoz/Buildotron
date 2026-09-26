import {
  defaultFeatureItems,
  defaultFAQItems,
  defaultStepItems,
  defaultSpecifications,
  defaultSlot,
  sectionTypes,
  slots,
} from './project.ts'
import type {
  Project,
  SectionInstance,
  SectionProperties,
  SectionType,
  Slot,
} from './project.ts'
import { isSafeHref, isSafeImageSrc } from '@buildotron/plugin-sdk'
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
      Object.assign(properties, { [field.name]: fieldValue })
    }
    if (type === 'CTA' || type === 'Hero') {
      const actionLabel = properties.actionLabel ?? ''
      const actionHref = properties.actionHref ?? ''
      if (actionHref && (!isSafeHref(actionHref) || !actionLabel.trim())) {
        throw new Error(
          `${label} : le lien du ${type} doit être une URL http(s), un chemin /... ou une ancre #..., avec un libellé.`,
        )
      }
    }
    if (type === 'Features' || type === 'Steps') {
      const items =
        raw.properties.items ??
        (type === 'Features' ? defaultFeatureItems : defaultStepItems)
      if (
        !Array.isArray(items) ||
        items.length < 1 ||
        items.length > 12 ||
        !items.every(
          (item) => record(item) && nonempty(item.title) && nonempty(item.body),
        )
      ) {
        throw new Error(
          `${label} : renseignez entre 1 et 12 éléments de ${type}, chacun avec un titre et un texte.`,
        )
      }
      properties.items = items.map((item) => ({
        title: item.title as string,
        body: item.body as string,
      }))
    }
    if (type === 'Gallery') {
      const images = raw.properties.images ?? []
      if (
        !Array.isArray(images) ||
        images.length > 12 ||
        !images.every(
          (image) =>
            record(image) &&
            typeof image.src === 'string' &&
            isSafeImageSrc(image.src) &&
            nonempty(image.alt),
        )
      ) {
        throw new Error(
          `${label} : chaque image Gallery doit avoir une URL http(s) ou un chemin /... et un texte alternatif non vide (12 images maximum).`,
        )
      }
      properties.images = images.map((image) => ({
        src: image.src as string,
        alt: image.alt as string,
      }))
    }
    if (type === 'FAQ') {
      const questions = raw.properties.questions ?? defaultFAQItems
      if (
        !Array.isArray(questions) ||
        questions.length < 1 ||
        questions.length > 12 ||
        !questions.every(
          (item) =>
            record(item) && nonempty(item.question) && nonempty(item.answer),
        )
      ) {
        throw new Error(
          `${label} : renseignez entre 1 et 12 questions FAQ, chacune avec une question et une réponse.`,
        )
      }
      properties.questions = questions.map((item) => ({
        question: item.question as string,
        answer: item.answer as string,
      }))
    }
    if (type === 'Footer' || type === 'Navbar') {
      const links = raw.properties.links ?? []
      if (
        !Array.isArray(links) ||
        links.length > 12 ||
        !links.every(
          (link) =>
            record(link) &&
            nonempty(link.label) &&
            typeof link.href === 'string' &&
            isSafeHref(link.href),
        )
      ) {
        throw new Error(
          `${label} : chaque lien ${type} doit avoir un libellé et une URL http(s), un chemin /... ou une ancre #... (12 liens maximum).`,
        )
      }
      properties.links = links.map((link) => ({
        label: link.label as string,
        href: link.href as string,
      }))
    }
    if (type === 'Specifications') {
      const specifications =
        raw.properties.specifications ?? defaultSpecifications
      if (
        !Array.isArray(specifications) ||
        specifications.length < 1 ||
        specifications.length > 20 ||
        !specifications.every(
          (item) =>
            record(item) && nonempty(item.label) && nonempty(item.value),
        )
      ) {
        throw new Error(
          `${label} : renseignez entre 1 et 20 caractéristiques avec un libellé et une valeur.`,
        )
      }
      properties.specifications = specifications.map((item) => ({
        label: item.label as string,
        value: item.value as string,
      }))
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
