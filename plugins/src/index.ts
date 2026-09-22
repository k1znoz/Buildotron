import { createElement } from 'react'
import type { ComponentType } from 'react'
import { HeroPreview } from '../Hero.plugin/editor/HeroPreview'
import { FeaturesPreview } from '../Features.plugin/editor/FeaturesPreview'
import { GalleryPreview } from '../Gallery.plugin/editor/GalleryPreview'
import { FAQPreview } from '../FAQ.plugin/editor/FAQPreview'
import { CTAPreview } from '../CTA.plugin/editor/CTAPreview'
import { FooterPreview } from '../Footer.plugin/editor/FooterPreview'
import type { SectionContentProps } from './types'

export const sectionPreviews: Record<
  string,
  ComponentType<SectionContentProps>
> = {
  Hero: HeroPreview,
  Features: FeaturesPreview,
  Gallery: GalleryPreview,
  FAQ: FAQPreview,
  CTA: CTAPreview,
  Footer: FooterPreview,
}

export function SectionPreview({
  type,
  title,
  body,
  actionLabel,
  actionHref,
  items,
  images,
  questions,
}: SectionContentProps & { type: string }) {
  const Preview = sectionPreviews[type]
  return Preview
    ? createElement(Preview, {
        title,
        body,
        actionLabel,
        actionHref,
        items,
        images,
        questions,
      })
    : null
}

export { Hero } from '../Hero.plugin/react/Hero'
export { Features } from '../Features.plugin/react/Features'
export { Gallery } from '../Gallery.plugin/react/Gallery'
export { FAQ } from '../FAQ.plugin/react/FAQ'
export { CTA } from '../CTA.plugin/react/CTA'
export { Footer } from '../Footer.plugin/react/Footer'
export type { SectionContentProps } from './types'
