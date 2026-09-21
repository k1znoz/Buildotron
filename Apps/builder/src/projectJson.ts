import { defaultCTAActionLabel, defaultSlot, sectionTypes, slots } from './project.ts'
import type { Project, SectionInstance, SectionProperties, SectionType, Slot } from './project.ts'
import { isSafeHref } from '@buildotron/plugin-sdk'

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
  if (value.formatVersion !== 1) throw new Error('Version du format non prise en charge (attendue : 1).')
  if (!nonempty(value.id) || !nonempty(value.name)) throw new Error('Identifiant ou nom du projet manquant.')
  if (value.blueprint !== 'product-landing' || value.theme !== 'minimal') {
    throw new Error('Blueprint ou thème non pris en charge par cette version du Builder.')
  }
  if (!Array.isArray(value.sections)) throw new Error('La liste des sections est invalide.')

  const ids = new Set<string>()
  const sections: SectionInstance[] = value.sections.map((raw, index) => {
    const label = `Section ${index + 1}`
    if (!record(raw) || !nonempty(raw.id) || ids.has(raw.id)) {
      throw new Error(`${label} : identifiant absent ou dupliqué.`)
    }
    ids.add(raw.id)
    if (typeof raw.type !== 'string' || !sectionTypes.includes(raw.type as SectionType)) {
      throw new Error(`${label} : type inconnu.`)
    }
    if (typeof raw.slot !== 'string' || !slots.includes(raw.slot as Slot)) {
      throw new Error(`${label} : slot inconnu.`)
    }
    if (typeof raw.override !== 'boolean') throw new Error(`${label} : override invalide.`)
    const type = raw.type as SectionType
    const slot = raw.slot as Slot
    if (slot !== defaultSlot[type] && !raw.override) {
      throw new Error(`${label} : placement hors slot sans override.`)
    }
    if (!record(raw.properties) || typeof raw.properties.title !== 'string' || typeof raw.properties.body !== 'string') {
      throw new Error(`${label} : propriétés invalides.`)
    }
    const properties: SectionProperties = { title: raw.properties.title, body: raw.properties.body }
    if (type === 'CTA') {
      const actionLabel = raw.properties.actionLabel ?? defaultCTAActionLabel
      const actionHref = raw.properties.actionHref ?? ''
      if (typeof actionLabel !== 'string' || typeof actionHref !== 'string') {
        throw new Error(`${label} : action du CTA invalide.`)
      }
      if (actionHref && (!isSafeHref(actionHref) || !actionLabel.trim())) {
        throw new Error(`${label} : le lien du CTA doit être une URL http(s), un chemin /... ou une ancre #..., avec un libellé.`)
      }
      properties.actionLabel = actionLabel
      properties.actionHref = actionHref
    }
    return { id: raw.id, type, slot, override: raw.override, properties }
  })

  return { formatVersion: 1, id: value.id, name: value.name,
    blueprint: 'product-landing', theme: 'minimal', sections }
}

export function serializeProject(project: Project): string {
  return `${JSON.stringify(project, null, 2)}\n`
}
