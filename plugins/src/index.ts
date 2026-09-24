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
export { FeaturesAdminForm } from '../Features.plugin/admin/FeaturesAdminForm'
export { validateFeaturesContent } from '../Features.plugin/admin/featuresContent'
export type { FeaturesContent } from '../Features.plugin/admin/featuresContent'
export { Gallery } from '../Gallery.plugin/react/Gallery'
export { GalleryAdminForm } from '../Gallery.plugin/admin/GalleryAdminForm'
export { validateGalleryContent } from '../Gallery.plugin/admin/galleryContent'
export type { GalleryContent } from '../Gallery.plugin/admin/galleryContent'
export { FAQ } from '../FAQ.plugin/react/FAQ'
export { FAQAdminForm } from '../FAQ.plugin/admin/FAQAdminForm'
export { validateFAQContent } from '../FAQ.plugin/admin/faqContent'
export type { FAQContent } from '../FAQ.plugin/admin/faqContent'
export { CTA } from '../CTA.plugin/react/CTA'
export { CTAAdminForm } from '../CTA.plugin/admin/CTAAdminForm'
export { validateCTAContent } from '../CTA.plugin/admin/ctaContent'
export type { CTAContent } from '../CTA.plugin/admin/ctaContent'
export { Footer } from '../Footer.plugin/react/Footer'
export { FooterAdminForm } from '../Footer.plugin/admin/FooterAdminForm'
export { validateFooterContent } from '../Footer.plugin/admin/footerContent'
export type { FooterContent } from '../Footer.plugin/admin/footerContent'
export { Navbar } from '../Navbar.plugin/react/Navbar'
export { NavbarAdminForm } from '../Navbar.plugin/admin/NavbarAdminForm'
export { validateNavbarContent } from '../Navbar.plugin/admin/navbarContent'
export type { NavbarContent } from '../Navbar.plugin/admin/navbarContent'
export type { SectionContentProps } from './types'
