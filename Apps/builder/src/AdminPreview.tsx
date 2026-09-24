import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import {
  CTA,
  CTAAdminForm,
  FAQ,
  FAQAdminForm,
  Features,
  FeaturesAdminForm,
  Footer,
  FooterAdminForm,
  Gallery,
  GalleryAdminForm,
  Hero,
  HeroAdminForm,
  Navbar,
  NavbarAdminForm,
} from '@buildotron/plugins'
import type {
  FeaturesContent,
  FAQContent,
  GalleryContent,
  HeroContent,
  FooterContent,
  NavbarContent,
} from '@buildotron/plugins'
import './AdminPreview.css'

const heroContent: HeroContent = {
  title: 'A clear starting point for your product.',
  body: 'A structural preview of the selected Blueprint.',
  actionLabel: 'Learn more',
  actionHref: '',
}

const ctaContent: HeroContent = {
  title: 'Ready to get started?',
  body: 'Choose the next step for your project.',
  actionLabel: 'Contact us',
  actionHref: '/contact',
}

const featuresContent: FeaturesContent = {
  title: 'Features',
  body: 'Describe the benefits of your product.',
  items: [
    { title: 'Fast setup', body: 'Start your project quickly.' },
    { title: 'Flexible design', body: 'Adapt the content to your needs.' },
  ],
}

const galleryContent: GalleryContent = {
  title: 'Gallery',
  body: 'A visual selection from the project.',
  images: [{ src: '/gallery-validation.svg', alt: 'Motif de validation' }],
}

const faqContent: FAQContent = {
  title: 'FAQ',
  body: 'Answers to common questions.',
  questions: [
    { question: 'How does it work?', answer: 'Start in the Builder.' },
    { question: 'Can I save my work?', answer: 'Yes, as a JSON project.' },
  ],
}

const footerContent: FooterContent = {
  title: 'Buildotron',
  body: 'Useful information and legal pages.',
  links: [
    { label: 'Legal notice', href: '/legal' },
    { label: 'Contact', href: '#contact' },
  ],
}

const navbarContent: NavbarContent = {
  title: 'Buildotron',
  body: 'Main navigation',
  links: [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
  ],
}

type PreviewType =
  | 'hero'
  | 'cta'
  | 'features'
  | 'gallery'
  | 'faq'
  | 'footer'
  | 'navbar'

const previewLabels: Record<PreviewType, string> = {
  hero: 'Hero',
  cta: 'CTA',
  features: 'Features',
  gallery: 'Gallery',
  faq: 'FAQ',
  footer: 'Footer',
  navbar: 'Navbar',
}

function typeFromLocation(): PreviewType {
  const section = new URLSearchParams(window.location.search).get('section')
  return section === 'cta' ||
    section === 'features' ||
    section === 'gallery' ||
    section === 'faq' ||
    section === 'footer' ||
    section === 'navbar'
    ? section
    : 'hero'
}

export function AdminPreview() {
  const [type, setType] = useState<PreviewType>(typeFromLocation)
  const [heroAppliedContent, setHeroAppliedContent] = useState(heroContent)
  const [ctaAppliedContent, setCTAAppliedContent] = useState(ctaContent)
  const [featuresAppliedContent, setFeaturesAppliedContent] =
    useState(featuresContent)
  const [galleryAppliedContent, setGalleryAppliedContent] =
    useState(galleryContent)
  const [faqAppliedContent, setFAQAppliedContent] = useState(faqContent)
  const [footerAppliedContent, setFooterAppliedContent] =
    useState(footerContent)
  const [navbarAppliedContent, setNavbarAppliedContent] =
    useState(navbarContent)
  const [heroApplied, setHeroApplied] = useState(false)
  const [ctaApplied, setCTAApplied] = useState(false)
  const [featuresApplied, setFeaturesApplied] = useState(false)
  const [galleryApplied, setGalleryApplied] = useState(false)
  const [faqApplied, setFAQApplied] = useState(false)
  const [footerApplied, setFooterApplied] = useState(false)
  const [navbarApplied, setNavbarApplied] = useState(false)

  useEffect(() => {
    const syncLocation = () => setType(typeFromLocation())
    window.addEventListener('popstate', syncLocation)
    return () => window.removeEventListener('popstate', syncLocation)
  }, [])

  function navigate(
    event: MouseEvent<HTMLAnchorElement>,
    destination: PreviewType,
  ) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    event.preventDefault()
    if (destination === type) return
    const url =
      destination === 'hero'
        ? '/admin-preview'
        : `/admin-preview?section=${destination}`
    window.history.pushState(null, '', url)
    setType(destination)
  }

  return (
    <main className="admin-preview">
      <header className="admin-preview__header">
        <div>
          <p className="admin-preview__eyebrow">
            Buildotron · test de composant
          </p>
          <h1>Formulaire de contenu {previewLabels[type]}</h1>
          <p>
            Aperçu isolé du futur formulaire CMS. Les modifications restent en
            mémoire dans cette page.
          </p>
        </div>
        <nav aria-label="Aperçus des formulaires">
          <a
            href="/admin-preview"
            aria-current={type === 'hero' ? 'page' : undefined}
            onClick={(event) => navigate(event, 'hero')}
          >
            Hero
          </a>{' '}
          <a
            href="/admin-preview?section=cta"
            aria-current={type === 'cta' ? 'page' : undefined}
            onClick={(event) => navigate(event, 'cta')}
          >
            CTA
          </a>{' '}
          <a
            href="/admin-preview?section=features"
            aria-current={type === 'features' ? 'page' : undefined}
            onClick={(event) => navigate(event, 'features')}
          >
            Features
          </a>{' '}
          <a
            href="/admin-preview?section=gallery"
            aria-current={type === 'gallery' ? 'page' : undefined}
            onClick={(event) => navigate(event, 'gallery')}
          >
            Gallery
          </a>{' '}
          <a
            href="/admin-preview?section=faq"
            aria-current={type === 'faq' ? 'page' : undefined}
            onClick={(event) => navigate(event, 'faq')}
          >
            FAQ
          </a>{' '}
          <a
            href="/admin-preview?section=footer"
            aria-current={type === 'footer' ? 'page' : undefined}
            onClick={(event) => navigate(event, 'footer')}
          >
            Footer
          </a>{' '}
          <a
            href="/admin-preview?section=navbar"
            aria-current={type === 'navbar' ? 'page' : undefined}
            onClick={(event) => navigate(event, 'navbar')}
          >
            Navbar
          </a>{' '}
          <a href="/">Retour au Builder</a>
        </nav>
      </header>
      <div className="admin-preview__layout">
        <section className="admin-preview__panel" aria-labelledby="form-title">
          <h2 id="form-title">Contenu</h2>
          <div hidden={type !== 'cta'}>
            <CTAAdminForm
              initialContent={ctaContent}
              onApply={(next) => {
                setCTAAppliedContent(next)
                setCTAApplied(true)
              }}
            />
          </div>
          <div hidden={type !== 'hero'}>
            <HeroAdminForm
              initialContent={heroContent}
              onApply={(next) => {
                setHeroAppliedContent(next)
                setHeroApplied(true)
              }}
            />
          </div>
          <div hidden={type !== 'features'}>
            <FeaturesAdminForm
              initialContent={featuresContent}
              onApply={(next) => {
                setFeaturesAppliedContent(next)
                setFeaturesApplied(true)
              }}
            />
          </div>
          <div hidden={type !== 'gallery'}>
            <GalleryAdminForm
              initialContent={galleryContent}
              onApply={(next) => {
                setGalleryAppliedContent(next)
                setGalleryApplied(true)
              }}
            />
          </div>
          <div hidden={type !== 'faq'}>
            <FAQAdminForm
              initialContent={faqContent}
              onApply={(next) => {
                setFAQAppliedContent(next)
                setFAQApplied(true)
              }}
            />
          </div>
          <div hidden={type !== 'footer'}>
            <FooterAdminForm
              initialContent={footerContent}
              onApply={(next) => {
                setFooterAppliedContent(next)
                setFooterApplied(true)
              }}
            />
          </div>
          <div hidden={type !== 'navbar'}>
            <NavbarAdminForm
              initialContent={navbarContent}
              onApply={(next) => {
                setNavbarAppliedContent(next)
                setNavbarApplied(true)
              }}
            />
          </div>
          <p role="status">
            {(
              type === 'cta'
                ? ctaApplied
                : type === 'features'
                  ? featuresApplied
                  : type === 'gallery'
                    ? galleryApplied
                    : type === 'faq'
                      ? faqApplied
                      : type === 'footer'
                        ? footerApplied
                        : type === 'navbar'
                          ? navbarApplied
                          : heroApplied
            )
              ? "Modifications appliquées à l'aperçu."
              : ''}
          </p>
        </section>
        <section
          className="admin-preview__panel"
          aria-labelledby="preview-title"
        >
          <h2 id="preview-title">Aperçu React</h2>
          {type === 'cta' ? (
            <CTA {...ctaAppliedContent} preview />
          ) : type === 'features' ? (
            <Features {...featuresAppliedContent} />
          ) : type === 'gallery' ? (
            <Gallery {...galleryAppliedContent} />
          ) : type === 'faq' ? (
            <FAQ {...faqAppliedContent} />
          ) : type === 'footer' ? (
            <Footer {...footerAppliedContent} preview />
          ) : type === 'navbar' ? (
            <Navbar {...navbarAppliedContent} preview />
          ) : (
            <Hero {...heroAppliedContent} preview />
          )}
        </section>
      </div>
    </main>
  )
}
