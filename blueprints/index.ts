import type {
  SectionProperties,
  SectionType,
  Slot,
} from '../Apps/builder/src/project.ts'

export const blueprintIds = [
  'product-landing',
  'coming-soon',
  'portfolio',
] as const
export type BlueprintId = (typeof blueprintIds)[number]

export type BlueprintDefinition = {
  id: BlueprintId
  name: string
  theme: 'minimal'
  slots: readonly Slot[]
  sections: readonly BlueprintSection[]
}

export type BlueprintSection = {
  type: SectionType
  properties?: Partial<SectionProperties>
}

export const blueprints: Record<BlueprintId, BlueprintDefinition> = {
  'product-landing': {
    id: 'product-landing',
    name: 'Product Landing',
    theme: 'minimal',
    slots: ['header', 'hero', 'content', 'conversion', 'footer'],
    sections: [
      {
        type: 'Hero',
        properties: {
          title: 'Present your product with a clear promise.',
          body: 'Explain the main benefit and guide visitors to the next step.',
          actionLabel: 'Discover the product',
          actionHref: '#features',
        },
      },
      {
        type: 'Features',
        properties: {
          title: 'Why choose this product?',
          body: 'Highlight the benefits that matter most to your customers.',
        },
      },
      {
        type: 'CTA',
        properties: {
          title: 'Ready to get started?',
          body: 'Give visitors one clear action to continue.',
          actionLabel: 'Contact us',
          actionHref: '#contact',
        },
      },
    ],
  },
  'coming-soon': {
    id: 'coming-soon',
    name: 'Coming Soon',
    theme: 'minimal',
    slots: ['header', 'hero', 'content', 'conversion', 'footer'],
    sections: [
      {
        type: 'Hero',
        properties: {
          title: 'Something new is coming soon.',
          body: 'Introduce the project and set expectations before launch.',
        },
      },
      {
        type: 'CTA',
        properties: {
          title: 'Be the first to know.',
          body: 'Invite visitors to follow the launch.',
          actionLabel: 'Join the waitlist',
          actionHref: '#contact',
        },
      },
      {
        type: 'Footer',
        properties: { title: 'Coming Soon', body: 'Launch information.' },
      },
    ],
  },
  portfolio: {
    id: 'portfolio',
    name: 'Portfolio',
    theme: 'minimal',
    slots: ['header', 'hero', 'content', 'conversion', 'footer'],
    sections: [
      {
        type: 'Navbar',
        properties: {
          title: 'Portfolio',
          body: 'Navigate through the selected work.',
          links: [{ label: 'Projects', href: '#projects' }],
        },
      },
      {
        type: 'Hero',
        properties: {
          title: 'Selected work and experience.',
          body: 'Introduce the person, studio or practice behind the projects.',
        },
      },
      {
        type: 'Gallery',
        properties: {
          title: 'Selected projects',
          body: 'Add project images and describe each one.',
        },
      },
      {
        type: 'Footer',
        properties: {
          title: 'Get in touch',
          body: 'Contact and professional links.',
          links: [{ label: 'Contact', href: '#contact' }],
        },
      },
    ],
  },
}
