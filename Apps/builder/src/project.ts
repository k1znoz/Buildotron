export const slots = [
  'header',
  'hero',
  'content',
  'conversion',
  'footer',
] as const
export type Slot = (typeof slots)[number]

export const sectionTypes = [
  'Navbar',
  'Hero',
  'Features',
  'Gallery',
  'FAQ',
  'CTA',
  'Footer',
] as const
export type SectionType = (typeof sectionTypes)[number]

export const defaultSlot: Record<SectionType, Slot> = {
  Navbar: 'header',
  Hero: 'hero',
  Features: 'content',
  Gallery: 'content',
  FAQ: 'content',
  CTA: 'conversion',
  Footer: 'footer',
}

export type SectionProperties = {
  title: string
  body: string
  actionLabel?: string
  actionHref?: string
  items?: FeatureItem[]
  images?: GalleryImage[]
  questions?: FAQItem[]
  links?: FooterLink[]
}
export type FeatureItem = { title: string; body: string }
export type GalleryImage = { src: string; alt: string }
export type FAQItem = { question: string; answer: string }
export type FooterLink = { label: string; href: string }
export const defaultFeatureItems: FeatureItem[] = [
  { title: 'Fast setup', body: 'Describe the first benefit.' },
  { title: 'Flexible design', body: 'Describe the second benefit.' },
  { title: 'Ready to grow', body: 'Describe the third benefit.' },
]
export const defaultFAQItems: FAQItem[] = [
  {
    question: 'How does it work?',
    answer: 'Explain the main steps in a few sentences.',
  },
]
export const defaultCTAActionLabel = 'Get started'
export const defaultHeroActionLabel = 'Learn more'
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

const defaults: Record<SectionType, SectionProperties> = {
  Navbar: { title: 'Navigation', body: 'Links to the main pages.', links: [] },
  Hero: {
    title: 'A clear starting point for your product.',
    body: 'A structural preview of the selected Blueprint.',
    actionLabel: defaultHeroActionLabel,
    actionHref: '',
  },
  Features: {
    title: 'Features',
    body: 'Describe your key benefits.',
    items: defaultFeatureItems,
  },
  Gallery: { title: 'Gallery', body: 'Showcase your images.', images: [] },
  FAQ: {
    title: 'FAQ',
    body: 'Answer common questions.',
    questions: defaultFAQItems,
  },
  CTA: {
    title: 'Get started',
    body: 'Invite visitors to take action.',
    actionLabel: defaultCTAActionLabel,
    actionHref: '',
  },
  Footer: { title: 'Footer', body: 'Contact and legal links.', links: [] },
}

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
