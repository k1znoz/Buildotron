import { pluginCatalog } from '@buildotron/plugins/catalog'

export const slots = [
  'header',
  'hero',
  'content',
  'conversion',
  'footer',
] as const
export type Slot = (typeof slots)[number]

export type SectionType = (typeof pluginCatalog)[number]['manifest']['name']
export const sectionTypes: readonly SectionType[] = pluginCatalog.map(
  (plugin) => plugin.manifest.name,
)

export const defaultSlot = Object.fromEntries(
  pluginCatalog.map((plugin) => [
    plugin.manifest.name,
    plugin.manifest.defaultSlot,
  ]),
) as Record<SectionType, Slot>

export type SectionProperties = {
  title: string
  body: string
  actionLabel?: string
  actionHref?: string
  items?: FeatureItem[]
  images?: GalleryImage[]
  questions?: FAQItem[]
  links?: FooterLink[]
  specifications?: SpecificationItem[]
}
export type FeatureItem = { title: string; body: string }
export type GalleryImage = { src: string; alt: string }
export type FAQItem = { question: string; answer: string }
export type FooterLink = { label: string; href: string }
export type SpecificationItem = { label: string; value: string }
export type SectionInstance = {
  id: string
  type: SectionType
  slot: Slot
  override: boolean
  properties: SectionProperties
}
export type Project = {
  formatVersion: 1
  id: string
  name: string
  blueprint: BlueprintId
  theme: 'minimal'
  sections: SectionInstance[]
}

const defaults = Object.fromEntries(
  pluginCatalog.map((plugin) => [
    plugin.manifest.name,
    plugin.manifest.defaults,
  ]),
) as unknown as Record<SectionType, SectionProperties>

export const defaultFeatureItems: FeatureItem[] = structuredClone(
  defaults.Features.items ?? [],
)
export const defaultFAQItems: FAQItem[] = structuredClone(
  defaults.FAQ.questions ?? [],
)
export const defaultStepItems: FeatureItem[] = structuredClone(
  defaults.Steps.items ?? [],
)
export const defaultSpecifications: SpecificationItem[] = structuredClone(
  defaults.Specifications.specifications ?? [],
)
export const defaultCTAActionLabel = defaults.CTA.actionLabel ?? ''
export const defaultHeroActionLabel = defaults.Hero.actionLabel ?? ''

function cloneProperties(properties: SectionProperties): SectionProperties {
  return structuredClone(properties)
}

export function createSection(
  type: SectionType,
  properties: Partial<SectionProperties> = {},
): SectionInstance {
  return {
    id: crypto.randomUUID(),
    type,
    slot: defaultSlot[type],
    override: false,
    properties: cloneProperties({ ...defaults[type], ...properties }),
  }
}

export function createProjectFromBlueprint(
  blueprint: BlueprintId,
  name = 'Untitled',
  id: string = crypto.randomUUID(),
): Project {
  const definition = blueprints[blueprint]
  return {
    formatVersion: 1,
    id,
    name,
    blueprint,
    theme: definition.theme,
    sections: definition.sections.map((section) =>
      createSection(section.type, section.properties),
    ),
  }
}

export const initialProject = createProjectFromBlueprint('product-landing')

export const slotLabels: Record<Slot, string> = {
  header: 'Header',
  hero: 'Hero',
  content: 'Content',
  conversion: 'Conversion',
  footer: 'Footer',
}
import { blueprints } from '../../../blueprints/index.ts'
import type { BlueprintId } from '../../../blueprints/index.ts'
