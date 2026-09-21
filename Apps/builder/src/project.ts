export const slots = ['header', 'hero', 'content', 'conversion', 'footer'] as const
export type Slot = (typeof slots)[number]

export const sectionTypes = ['Navbar', 'Hero', 'Features', 'Gallery', 'FAQ', 'CTA', 'Footer'] as const
export type SectionType = (typeof sectionTypes)[number]

export const defaultSlot: Record<SectionType, Slot> = {
  Navbar: 'header', Hero: 'hero', Features: 'content', Gallery: 'content',
  FAQ: 'content', CTA: 'conversion', Footer: 'footer',
}

export type SectionProperties = { title: string; body: string; actionLabel?: string; actionHref?: string }
export const defaultCTAActionLabel = 'Get started'
export type SectionInstance = { id: string; type: SectionType; slot: Slot; override: boolean; properties: SectionProperties }
export type Project = {
  formatVersion: 1
  id: string
  name: string
  blueprint: 'product-landing'
  theme: 'minimal'
  sections: SectionInstance[]
}

const defaults: Record<SectionType, SectionProperties> = {
  Navbar: { title: 'Navigation', body: 'Links to the main pages.' },
  Hero: { title: 'A clear starting point for your product.', body: 'A structural preview of the selected Blueprint.' },
  Features: { title: 'Features', body: 'Describe your key benefits.' },
  Gallery: { title: 'Gallery', body: 'Showcase your images.' },
  FAQ: { title: 'FAQ', body: 'Answer common questions.' },
  CTA: { title: 'Get started', body: 'Invite visitors to take action.', actionLabel: defaultCTAActionLabel, actionHref: '' },
  Footer: { title: 'Footer', body: 'Contact and legal links.' },
}

export function createSection(type: SectionType): SectionInstance {
  return { id: crypto.randomUUID(), type, slot: defaultSlot[type], override: false, properties: { ...defaults[type] } }
}

export const initialProject: Project = {
  formatVersion: 1, id: crypto.randomUUID(), name: 'Untitled',
  blueprint: 'product-landing', theme: 'minimal',
  sections: [createSection('Hero'), createSection('Features'), createSection('CTA')],
}

export const slotLabels: Record<Slot, string> = {
  header: 'Header', hero: 'Hero', content: 'Content', conversion: 'Conversion', footer: 'Footer',
}
