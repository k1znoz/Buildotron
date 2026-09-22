import { createElement } from 'react'
import type { ComponentType } from 'react'
import { HeroPreview } from '../Hero.plugin/editor/HeroPreview'
import { FeaturesPreview } from '../Features.plugin/editor/FeaturesPreview'
import { GalleryPreview } from '../Gallery.plugin/editor/GalleryPreview'
import { FAQPreview } from '../FAQ.plugin/editor/FAQPreview'
import { CTAPreview } from '../CTA.plugin/editor/CTAPreview'
import { FooterPreview } from '../Footer.plugin/editor/FooterPreview'
import { NavbarPreview } from '../Navbar.plugin/editor/NavbarPreview'
import type { SectionContentProps } from './types'
import heroPreviewImage from '../Hero.plugin/preview.svg?url'
import featuresPreviewImage from '../Features.plugin/preview.svg?url'
import galleryPreviewImage from '../Gallery.plugin/preview.svg?url'
import faqPreviewImage from '../FAQ.plugin/preview.svg?url'
import ctaPreviewImage from '../CTA.plugin/preview.svg?url'
import footerPreviewImage from '../Footer.plugin/preview.svg?url'
import navbarPreviewImage from '../Navbar.plugin/preview.svg?url'

export const sectionPreviewImages: Record<string, string> = {
  Navbar: navbarPreviewImage,
  Hero: heroPreviewImage,
  Features: featuresPreviewImage,
  Gallery: galleryPreviewImage,
  FAQ: faqPreviewImage,
  CTA: ctaPreviewImage,
  Footer: footerPreviewImage,
}

export const sectionPreviews: Record<
  string,
  ComponentType<SectionContentProps>
> = {
  Navbar: NavbarPreview,
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
  links,
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
        links,
      })
    : null
}

export { Hero } from '../Hero.plugin/react/Hero'
export { HeroAdminForm } from '../Hero.plugin/admin/HeroAdminForm'
export { validateHeroContent } from '../Hero.plugin/admin/heroContent'
export type { HeroContent } from '../Hero.plugin/admin/heroContent'
export { Features } from '../Features.plugin/react/Features'
export { Gallery } from '../Gallery.plugin/react/Gallery'
export { FAQ } from '../FAQ.plugin/react/FAQ'
export { CTA } from '../CTA.plugin/react/CTA'
export { Footer } from '../Footer.plugin/react/Footer'
export { Navbar } from '../Navbar.plugin/react/Navbar'
export type { SectionContentProps } from './types'
