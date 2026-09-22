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
  blueprint: 'product-landing'
  theme: 'minimal'
  sections: SectionInstance[]
}

const defaults: Record<SectionType, SectionProperties> = {
  Navbar: { title: 'Navigation', body: 'Links to the main pages.' },
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

export function createSection(type: SectionType): SectionInstance {
  return {
    id: crypto.randomUUID(),
    type,
    slot: defaultSlot[type],
    override: false,
    properties: {
      ...defaults[type],
      ...(type === 'Features'
        ? { items: defaultFeatureItems.map((item) => ({ ...item })) }
        : {}),
      ...(type === 'Gallery' ? { images: [] } : {}),
      ...(type === 'FAQ'
        ? { questions: defaultFAQItems.map((item) => ({ ...item })) }
        : {}),
      ...(type === 'Footer' ? { links: [] } : {}),
    },
  }
}

export const initialProject: Project = {
  formatVersion: 1,
  id: crypto.randomUUID(),
  name: 'Untitled',
  blueprint: 'product-landing',
  theme: 'minimal',
  sections: [
    createSection('Hero'),
    createSection('Features'),
    createSection('CTA'),
  ],
}

export const slotLabels: Record<Slot, string> = {
  header: 'Header',
  hero: 'Hero',
  content: 'Content',
  conversion: 'Conversion',
  footer: 'Footer',
}
