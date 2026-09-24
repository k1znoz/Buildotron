import Handlebars from 'handlebars'
import { createContentDocument } from '@buildotron/core-cms'
import { isSafeHref, isSafeImageSrc } from '@buildotron/plugin-sdk'

export type GeneratorSection = {
  id: string
  type: string
  slot: string
  override: boolean
  properties: {
    title: string
    body: string
    actionLabel?: string
    actionHref?: string
    items?: unknown[]
    images?: unknown[]
    questions?: unknown[]
    links?: unknown[]
  }
}

export type GeneratorProject = {
  formatVersion: number
  id: string
  name: string
  blueprint: string
  theme: string
  sections: GeneratorSection[]
}

export type GeneratedProject = Record<string, string>

const supportedSections = [
  'Navbar',
  'Hero',
  'Features',
  'Gallery',
  'FAQ',
  'CTA',
  'Footer',
] as const

function nonempty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function safeHref(value: unknown): value is string {
  return typeof value === 'string' && isSafeHref(value)
}

function safeImageSrc(value: unknown): value is string {
  return typeof value === 'string' && isSafeImageSrc(value)
}

export function validateProjectForGeneration(
  project: GeneratorProject,
): string[] {
  const issues: string[] = []
  if (project.formatVersion !== 1) issues.push('Format version 1 requis.')
  if (!nonempty(project.id) || !nonempty(project.name))
    issues.push('Identifiant et nom du projet requis.')
  if (!Array.isArray(project.sections) || project.sections.length === 0) {
    issues.push('Le projet doit contenir au moins une section.')
    return issues
  }

  project.sections.forEach((section, index) => {
    const label = `Section ${index + 1}`
    const content = section.properties
    if (
      !supportedSections.includes(
        section.type as (typeof supportedSections)[number],
      )
    )
      issues.push(`${label} : type non pris en charge.`)
    if (!content || typeof content !== 'object') {
      issues.push(`${label} : titre et texte requis.`)
      return
    }
    if (!nonempty(content.title) || !nonempty(content.body))
      issues.push(`${label} : titre et texte requis.`)
    if (
      section.type === 'CTA' &&
      (!nonempty(content.actionLabel) || !safeHref(content.actionHref))
    )
      issues.push(`${label} : action CTA valide requise.`)
    if (
      section.type === 'Hero' &&
      content.actionHref &&
      (!nonempty(content.actionLabel) || !safeHref(content.actionHref))
    )
      issues.push(`${label} : action Hero invalide.`)
    if (
      section.type === 'Features' &&
      (!Array.isArray(content.items) || content.items.length === 0)
    )
      issues.push(`${label} : au moins un élément Features requis.`)
    if (
      section.type === 'Gallery' &&
      (!Array.isArray(content.images) ||
        content.images.length === 0 ||
        content.images.some(
          (image) =>
            typeof image !== 'object' ||
            image === null ||
            !safeImageSrc((image as { src?: unknown }).src) ||
            !nonempty((image as { alt?: unknown }).alt),
        ))
    )
      issues.push(`${label} : au moins une image Gallery valide requise.`)
    if (
      section.type === 'FAQ' &&
      (!Array.isArray(content.questions) || content.questions.length === 0)
    )
      issues.push(`${label} : au moins une question FAQ requise.`)
    if (
      (section.type === 'Navbar' || section.type === 'Footer') &&
      (!Array.isArray(content.links) ||
        content.links.length === 0 ||
        content.links.some(
          (link) =>
            typeof link !== 'object' ||
            link === null ||
            !nonempty((link as { label?: unknown }).label) ||
            !safeHref((link as { href?: unknown }).href),
        ))
    )
      issues.push(`${label} : au moins un lien valide requis.`)
  })
  return issues
}

const appTemplate =
  Handlebars.compile(`import { useEffect, useState } from 'react'
import structureData from './structure.json'
import contentData from './cms/content.json'
import { applyCmsContent } from './cms/content'
import type { CmsContentDocument, ProjectStructure } from './cms/content'
import { SectionView } from './sections'
import './styles.css'

const structure = structureData as ProjectStructure
const initialContent = contentData as CmsContentDocument

function setMeta(name: string, content: string, property = false) {
  const attribute = property ? 'property' : 'name'
  let element = document.head.querySelector<HTMLMetaElement>('meta[' + attribute + '="' + name + '"]')
  if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.append(element) }
  element.content = content
}

export default function App() {
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    fetch('/api/content')
      .then((response) => {
        if (!response.ok) throw new Error('Contenu CMS indisponible.')
        return response.json() as Promise<CmsContentDocument>
      })
      .then(setContent)
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    fetch('/api/seo').then((response) => response.json()).then((seo) => {
      document.title = seo.title
      setMeta('description', seo.description)
      setMeta('og:title', seo.title, true)
      setMeta('og:description', seo.description, true)
      setMeta('twitter:card', seo.ogImage ? 'summary_large_image' : 'summary')
      setMeta('robots', seo.indexable ? 'index,follow' : 'noindex,nofollow')
      if (seo.ogImage) setMeta('og:image', seo.ogImage, true)
      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
      canonical.href = seo.canonical || window.location.href
    }).catch(() => undefined)
  }, [])

  const project = applyCmsContent(structure, content)
  return (
    <main>
      <h1 className="visually-hidden">{{projectName}}</h1>
      {project.sections.map((section) => <SectionView key={section.id} section={section} />)}
    </main>
  )
}
`)

const adminSource = `import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { CmsContentDocument } from './content'

type Product = { id: string; name: string; description: string; priceCents: number; currency: string; image: string; published: boolean }
type ProductInput = Omit<Product, 'id'>
type SeoSettings = { title: string; description: string; canonical: string; ogImage: string; indexable: boolean }
const emptyProduct: ProductInput = { name: '', description: '', priceCents: 0, currency: 'EUR', image: '', published: false }

async function readResponse(response: Response) {
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error ?? 'Une erreur est survenue.')
  return payload
}

function isSafeHref(value: string) {
  if (!value || value !== value.trim() || Array.from(value).some((character) => character.charCodeAt(0) <= 31 || character.charCodeAt(0) === 127)) return false
  if (value.startsWith('#')) return value.length > 1
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\\\')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function isSafeImageSrc(value: string) {
  return (value.length <= 7_000_000 && /^data:image\\/(?:jpeg|png|webp|gif);base64,[a-z0-9+/]+=*$/i.test(value)) || (isSafeHref(value) && !value.startsWith('#'))
}

function validateContent(document: CmsContentDocument) {
  const issues: string[] = []
  for (const section of document.sections) {
    const content = section.content
    if (!content.title.trim()) issues.push(section.sectionType + ' : le titre est obligatoire.')
    if (!content.body.trim()) issues.push(section.sectionType + ' : le texte est obligatoire.')
    if (section.sectionType === 'CTA' && (!content.actionLabel?.trim() || !content.actionHref || !isSafeHref(content.actionHref))) issues.push('CTA : le bouton doit avoir un libellé et un lien valides.')
    if (section.sectionType === 'Hero' && content.actionHref && (!content.actionLabel?.trim() || !isSafeHref(content.actionHref))) issues.push('Hero : l’action doit avoir un libellé et un lien valides.')
    content.items?.forEach((item, index) => {
      if (!item.title.trim() || !item.body.trim()) issues.push(section.sectionType + ' — carte ' + (index + 1) + ' : titre et texte obligatoires.')
    })
    content.images?.forEach((image, index) => {
      if (!image.alt.trim() || !isSafeImageSrc(image.src)) issues.push(section.sectionType + ' — image ' + (index + 1) + ' : source et texte alternatif valides obligatoires.')
    })
    content.questions?.forEach((item, index) => {
      if (!item.question.trim() || !item.answer.trim()) issues.push(section.sectionType + ' — question ' + (index + 1) + ' : question et réponse obligatoires.')
    })
    content.links?.forEach((link, index) => {
      if (!link.label.trim() || !isSafeHref(link.href)) issues.push(section.sectionType + ' — lien ' + (index + 1) + ' : libellé et destination valides obligatoires.')
    })
  }
  return issues
}

export default function Admin() {
  const [content, setContent] = useState<CmsContentDocument | null>(null)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [status, setStatus] = useState('Connectez-vous pour modifier le contenu.')
  const [notice, setNotice] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<ProductInput>(emptyProduct)
  const [seo, setSeo] = useState<SeoSettings | null>(null)

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(null), 3500)
    return () => window.clearTimeout(timeout)
  }, [notice])

  useEffect(() => {
    fetch('/api/content')
      .then(readResponse)
      .then((document) => setContent(document as CmsContentDocument))
      .catch((error: unknown) => setStatus(error instanceof Error ? error.message : 'Chargement impossible.'))
  }, [])

  async function login(event: FormEvent) {
    event.preventDefault()
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      }).then(readResponse)
      setAuthenticated(true)
      setPassword('')
      setUploadError(null)
      setStatus('Connexion réussie.')
      const catalog = await fetch('/api/admin/products').then(readResponse) as Product[]
      setProducts(catalog)
      const seoSettings = await fetch('/api/seo').then(readResponse) as SeoSettings
      setSeo(seoSettings)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Connexion impossible.')
    }
  }

  function updateSection(index: number, field: 'title' | 'body' | 'actionLabel' | 'actionHref', value: string) {
    setContent((current) => {
      if (!current) return current
      const next = structuredClone(current)
      next.sections[index].content[field] = value
      return next
    })
  }

  function updateItem(sectionIndex: number, group: 'items' | 'images' | 'questions' | 'links', itemIndex: number, field: string, value: string) {
    setContent((current) => {
      if (!current) return current
      const next = structuredClone(current)
      const list = next.sections[sectionIndex].content[group] as Array<Record<string, string>>
      list[itemIndex][field] = value
      return next
    })
  }

  async function uploadImage(sectionIndex: number, itemIndex: number, file: File) {
    setUploadError(null)
    setStatus('Envoi de l’image…')
    try {
      const uploaded = await fetch('/api/media', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': file.type },
        body: file,
      }).then(readResponse) as { path: string }
      updateItem(sectionIndex, 'images', itemIndex, 'src', uploaded.path)
      setStatus('')
      setNotice('Image envoyée. Enregistrez le contenu pour confirmer son utilisation.')
    } catch (error) {
      setStatus('')
      setUploadError(error instanceof Error ? error.message : 'Envoi impossible.')
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!content) return
    const issues = validateContent(content)
    if (issues.length) {
      setStatus('Corrigez les erreurs affichées avant d’enregistrer.')
      return
    }
    try {
      const saved = await fetch('/api/content', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(content),
      }).then(readResponse)
      setContent(saved as CmsContentDocument)
      setStatus('')
      setNotice('Contenu enregistré.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Enregistrement impossible.')
    }
  }

  function productIssue(product: ProductInput) {
    if (!product.name.trim() || !product.description.trim()) return 'Nom et description du produit obligatoires.'
    if (!Number.isInteger(product.priceCents) || product.priceCents < 0) return 'Le prix doit être un nombre positif de centimes.'
    if (!/^[A-Z]{3}$/.test(product.currency)) return 'La devise doit utiliser trois lettres majuscules.'
    return null
  }

  async function createProduct(event: FormEvent) {
    event.preventDefault()
    const issue = productIssue(newProduct)
    if (issue) { setStatus(issue); return }
    try {
      const created = await fetch('/api/admin/products', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(newProduct) }).then(readResponse) as Product
      setProducts((current) => [...current, created])
      setNewProduct(emptyProduct)
      setStatus('')
      setNotice('Produit créé.')
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Création impossible.') }
  }

  function changeProduct(index: number, field: keyof ProductInput, value: string | number | boolean) {
    setProducts((current) => current.map((product, position) => position === index ? { ...product, [field]: value } : product))
  }

  async function saveProduct(index: number) {
    const product = products[index]
    const issue = productIssue(product)
    if (issue) { setStatus(issue); return }
    try {
      const saved = await fetch('/api/admin/products/' + encodeURIComponent(product.id), { method: 'PUT', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(product) }).then(readResponse) as Product
      setProducts((current) => current.map((item, position) => position === index ? saved : item))
      setStatus('')
      setNotice('Produit enregistré.')
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Enregistrement impossible.') }
  }

  async function removeProduct(index: number) {
    const product = products[index]
    if (!window.confirm('Supprimer définitivement « ' + product.name + ' » ?')) return
    const response = await fetch('/api/admin/products/' + encodeURIComponent(product.id), { method: 'DELETE', credentials: 'same-origin' })
    if (!response.ok) { setStatus('Suppression impossible.'); return }
    setProducts((current) => current.filter((_, position) => position !== index))
    setStatus('')
    setNotice('Produit supprimé.')
  }

  async function saveSeo(event: FormEvent) {
    event.preventDefault()
    if (!seo) return
    try {
      const saved = await fetch('/api/admin/seo', { method: 'PUT', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(seo) }).then(readResponse) as SeoSettings
      setSeo(saved)
      setStatus('')
      setNotice('Réglages SEO enregistrés.')
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Enregistrement SEO impossible.') }
  }

  if (!content) return <main className="admin"><p role="status">{status}</p></main>
  const contentIssues = authenticated ? validateContent(content) : []
  const blockingIssues = uploadError ? [uploadError, ...contentIssues] : contentIssues

  return (
    <main className="admin">
      <header className="admin__header"><div><p className="admin__eyebrow">Buildotron CMS</p><h1>Gestion du contenu</h1></div><a href="/">Voir le site</a></header>
      {!authenticated ? (
        <form className="admin__login" onSubmit={login}>
          <label htmlFor="password">Mot de passe</label>
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button type="submit">Se connecter</button>
        </form>
      ) : (
        <form onSubmit={save}>
          <div className="admin__sections">
            {content.sections.map((section, index) => (
              <fieldset className="admin__section" key={section.sectionId}>
                <legend>{section.sectionType}</legend>
                <label htmlFor={'title-' + section.sectionId}>Titre</label>
                <input id={'title-' + section.sectionId} value={section.content.title} onChange={(event) => updateSection(index, 'title', event.target.value)} required />
                <label htmlFor={'body-' + section.sectionId}>Texte</label>
                <textarea id={'body-' + section.sectionId} value={section.content.body} onChange={(event) => updateSection(index, 'body', event.target.value)} rows={4} required />
                {(section.sectionType === 'Hero' || section.sectionType === 'CTA') && <div className="admin__group">
                  <h2>Action</h2>
                  <label htmlFor={'action-label-' + section.sectionId}>Libellé</label>
                  <input id={'action-label-' + section.sectionId} value={section.content.actionLabel ?? ''} onChange={(event) => updateSection(index, 'actionLabel', event.target.value)} required={section.sectionType === 'CTA' || Boolean(section.content.actionHref)} />
                  <label htmlFor={'action-href-' + section.sectionId}>Lien</label>
                  <input id={'action-href-' + section.sectionId} value={section.content.actionHref ?? ''} onChange={(event) => updateSection(index, 'actionHref', event.target.value)} required={section.sectionType === 'CTA'} />
                </div>}
                {section.content.items?.map((item, itemIndex) => <div className="admin__group" key={itemIndex}>
                  <h2>{'Carte ' + (itemIndex + 1)}</h2>
                  <label htmlFor={'item-title-' + section.sectionId + '-' + itemIndex}>Titre</label>
                  <input id={'item-title-' + section.sectionId + '-' + itemIndex} value={item.title} onChange={(event) => updateItem(index, 'items', itemIndex, 'title', event.target.value)} required />
                  <label htmlFor={'item-body-' + section.sectionId + '-' + itemIndex}>Texte</label>
                  <textarea id={'item-body-' + section.sectionId + '-' + itemIndex} value={item.body} onChange={(event) => updateItem(index, 'items', itemIndex, 'body', event.target.value)} rows={3} required />
                </div>)}
                {section.content.images?.map((image, itemIndex) => <div className="admin__group" key={itemIndex}>
                  <h2>{'Image ' + (itemIndex + 1)}</h2>
                  <label htmlFor={'image-src-' + section.sectionId + '-' + itemIndex}>Source</label>
                  <input id={'image-src-' + section.sectionId + '-' + itemIndex} value={image.src} onChange={(event) => updateItem(index, 'images', itemIndex, 'src', event.target.value)} required />
                  <label htmlFor={'image-file-' + section.sectionId + '-' + itemIndex}>Remplacer par un fichier</label>
                  <input className="admin__file" id={'image-file-' + section.sectionId + '-' + itemIndex} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(index, itemIndex, file) }} />
                  <label htmlFor={'image-alt-' + section.sectionId + '-' + itemIndex}>Texte alternatif</label>
                  <input id={'image-alt-' + section.sectionId + '-' + itemIndex} value={image.alt} onChange={(event) => updateItem(index, 'images', itemIndex, 'alt', event.target.value)} required />
                </div>)}
                {section.content.questions?.map((item, itemIndex) => <div className="admin__group" key={itemIndex}>
                  <h2>{'Question ' + (itemIndex + 1)}</h2>
                  <label htmlFor={'question-' + section.sectionId + '-' + itemIndex}>Question</label>
                  <input id={'question-' + section.sectionId + '-' + itemIndex} value={item.question} onChange={(event) => updateItem(index, 'questions', itemIndex, 'question', event.target.value)} required />
                  <label htmlFor={'answer-' + section.sectionId + '-' + itemIndex}>Réponse</label>
                  <textarea id={'answer-' + section.sectionId + '-' + itemIndex} value={item.answer} onChange={(event) => updateItem(index, 'questions', itemIndex, 'answer', event.target.value)} rows={3} required />
                </div>)}
                {section.content.links?.map((link, itemIndex) => <div className="admin__group" key={itemIndex}>
                  <h2>{'Lien ' + (itemIndex + 1)}</h2>
                  <label htmlFor={'link-label-' + section.sectionId + '-' + itemIndex}>Libellé</label>
                  <input id={'link-label-' + section.sectionId + '-' + itemIndex} value={link.label} onChange={(event) => updateItem(index, 'links', itemIndex, 'label', event.target.value)} required />
                  <label htmlFor={'link-href-' + section.sectionId + '-' + itemIndex}>Destination</label>
                  <input id={'link-href-' + section.sectionId + '-' + itemIndex} value={link.href} onChange={(event) => updateItem(index, 'links', itemIndex, 'href', event.target.value)} required />
                </div>)}
              </fieldset>
            ))}
          </div>
          <button type="submit" disabled={blockingIssues.length > 0}>Enregistrer</button>
        </form>
      )}
      {authenticated && <section className="admin__catalog" aria-labelledby="catalog-title">
        <h2 id="catalog-title">Produits</h2>
        {products.map((product, index) => <article className="admin__product" key={product.id}>
          <label>Nom<input value={product.name} onChange={(event) => changeProduct(index, 'name', event.target.value)} /></label>
          <label>Description<textarea value={product.description} onChange={(event) => changeProduct(index, 'description', event.target.value)} rows={3} /></label>
          <label>Prix en centimes<input type="number" min="0" step="1" value={product.priceCents} onChange={(event) => changeProduct(index, 'priceCents', Number(event.target.value))} /></label>
          <label>Devise<input value={product.currency} maxLength={3} onChange={(event) => changeProduct(index, 'currency', event.target.value.toUpperCase())} /></label>
          <label>Image<input value={product.image} onChange={(event) => changeProduct(index, 'image', event.target.value)} /></label>
          <label className="admin__check"><input type="checkbox" checked={product.published} onChange={(event) => changeProduct(index, 'published', event.target.checked)} /> Publié</label>
          <div><button type="button" onClick={() => void saveProduct(index)}>Enregistrer le produit</button> <button className="admin__danger" type="button" onClick={() => void removeProduct(index)}>Supprimer</button></div>
        </article>)}
        <form className="admin__product" onSubmit={createProduct}>
          <h3>Nouveau produit</h3>
          <label>Nom<input value={newProduct.name} onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })} required /></label>
          <label>Description<textarea value={newProduct.description} onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })} rows={3} required /></label>
          <label>Prix en centimes<input type="number" min="0" step="1" value={newProduct.priceCents} onChange={(event) => setNewProduct({ ...newProduct, priceCents: Number(event.target.value) })} required /></label>
          <label>Devise<input value={newProduct.currency} maxLength={3} onChange={(event) => setNewProduct({ ...newProduct, currency: event.target.value.toUpperCase() })} required /></label>
          <label>Image<input value={newProduct.image} onChange={(event) => setNewProduct({ ...newProduct, image: event.target.value })} /></label>
          <label className="admin__check"><input type="checkbox" checked={newProduct.published} onChange={(event) => setNewProduct({ ...newProduct, published: event.target.checked })} /> Publié</label>
          <button type="submit">Créer le produit</button>
        </form>
      </section>}
      {authenticated && seo && <section className="admin__catalog" aria-labelledby="seo-title">
        <h2 id="seo-title">SEO</h2>
        <form className="admin__product" onSubmit={saveSeo}>
          <label>Titre SEO — {seo.title.length}/60<input value={seo.title} maxLength={60} onChange={(event) => setSeo({ ...seo, title: event.target.value })} required /></label>
          <label>Méta description — {seo.description.length}/160<textarea value={seo.description} maxLength={160} onChange={(event) => setSeo({ ...seo, description: event.target.value })} rows={3} required /></label>
          <label>URL canonique<input type="url" value={seo.canonical} onChange={(event) => setSeo({ ...seo, canonical: event.target.value })} placeholder="https://example.com/" /></label>
          <label>Image OpenGraph<input type="url" value={seo.ogImage} onChange={(event) => setSeo({ ...seo, ogImage: event.target.value })} placeholder="https://example.com/image.jpg" /></label>
          <label className="admin__check"><input type="checkbox" checked={seo.indexable} onChange={(event) => setSeo({ ...seo, indexable: event.target.checked })} /> Autoriser l’indexation</label>
          <button type="submit">Enregistrer le SEO</button>
        </form>
      </section>}
      {blockingIssues.length > 0 && <aside className="admin__errors" role="alert" aria-live="assertive" aria-atomic="true">
        <strong>{blockingIssues.length === 1 ? 'Une erreur bloque l’enregistrement' : blockingIssues.length + ' erreurs bloquent l’enregistrement'}</strong>
        <ul>{blockingIssues.map((issue, index) => <li key={index}>{issue}</li>)}</ul>
      </aside>}
      {notice && <p className="admin__notice" role="status" aria-live="polite">{notice}</p>}
      <p className="admin__status" role="status" aria-live="polite">{status}</p>
    </main>
  )
}
`

const sectionsSource = `type Item = { title: string; body: string }
type Image = { src: string; alt: string }
type Question = { question: string; answer: string }
type Link = { label: string; href: string }
export type Content = { title: string; body: string; items?: Item[]; images?: Image[]; questions?: Question[]; links?: Link[]; actionLabel?: string; actionHref?: string }
export type Section = { id: string; type: string; properties: Content }
export type ProjectContent = { sections: Section[] }

function Heading({ section }: { section: Section }) {
  return <><h2>{section.properties.title}</h2><p>{section.properties.body}</p></>
}

export function SectionView({ section }: { section: Section }) {
  const content = section.properties
  const common = <Heading section={section} />
  let details = null

  if (section.type === 'Features' && content.items) details = <div className="cards">{content.items.map((item, index) => <article className="card" key={index}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
  if (section.type === 'Gallery' && content.images) details = <div className="gallery">{content.images.map((image, index) => <img key={index} src={image.src} alt={image.alt} />)}</div>
  if (section.type === 'FAQ' && content.questions) details = <div className="faq">{content.questions.map((item, index) => <details className="card" key={index}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
  if ((section.type === 'Navbar' || section.type === 'Footer') && content.links) details = <nav aria-label={section.type === 'Navbar' ? 'Navigation principale' : 'Liens de pied de page'}><ul className="links">{content.links.map((link, index) => <li key={index}><a href={link.href}>{link.label}</a></li>)}</ul></nav>
  if ((section.type === 'Hero' || section.type === 'CTA') && content.actionHref) details = <a className="action" href={content.actionHref}>{content.actionLabel}</a>

  const element = <>{common}{details}</>
  if (section.type === 'Navbar') return <header className="section section--navbar" id={section.id}>{element}</header>
  if (section.type === 'Footer') return <footer className="section section--footer" id={section.id}>{element}</footer>
  return <section className={'section section--' + section.type.toLowerCase()} id={section.id}>{element}</section>
}
`

const cmsContentSource = `import type { Content, ProjectContent, Section } from '../sections'

export type ProjectStructure = {
  id: string
  name: string
  blueprint: string
  theme: string
  sections: Array<Omit<Section, 'properties'>>
}
export type CmsContentDocument = {
  formatVersion: 1
  projectId: string
  sections: Array<{ sectionId: string; sectionType: string; content: Content }>
}

export function applyCmsContent(structure: ProjectStructure, document: CmsContentDocument): ProjectContent {
  if (document.formatVersion !== 1 || document.projectId !== structure.id) throw new Error('Contenu CMS incompatible avec ce site.')
  if (document.sections.length !== structure.sections.length) throw new Error('Le CMS ne peut pas modifier la structure.')
  const contentById = new Map(document.sections.map((section) => [section.sectionId, section]))
  const sections = structure.sections.map((section) => {
    const editable = contentById.get(section.id)
    if (!editable || editable.sectionType !== section.type) throw new Error('Identité de section CMS invalide.')
    return { ...section, properties: editable.content }
  })
  return { sections }
}
`

const packageTemplate = Handlebars.compile(`{
  "name": "{{packageName}}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "start": "node server/index.mjs",
    "lint": "eslint .",
    "test": "node --test"
  },
  "dependencies": {
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    "eslint": "^10.9.0",
    "globals": "^17.11.0",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.67.0",
    "vite": "^8.2.2"
  }
}
`)

const eslintConfig = `import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
)
`

const contentTest = `import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const supported = new Set(['Navbar', 'Hero', 'Features', 'Gallery', 'FAQ', 'CTA', 'Footer'])
const structure = JSON.parse(await readFile(new URL('../src/structure.json', import.meta.url), 'utf8'))
const content = JSON.parse(await readFile(new URL('../src/cms/content.json', import.meta.url), 'utf8'))

test('CMS content matches the immutable generated structure', () => {
  assert.ok(structure.sections.length > 0)
  assert.ok(structure.sections.every((section) => supported.has(section.type)))
  assert.equal(content.projectId, structure.id)
  assert.deepEqual(
    content.sections.map(({ sectionId, sectionType }) => ({ id: sectionId, type: sectionType })),
    structure.sections.map(({ id, type }) => ({ id, type })),
  )
})
`

const contentStoreSource = `import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

function isSafeHref(value) {
  if (typeof value !== 'string' || !value || value !== value.trim() || Array.from(value).some((character) => character.charCodeAt(0) <= 31 || character.charCodeAt(0) === 127)) return false
  if (value.startsWith('#')) return value.length > 1
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\\\')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function isSafeImageSrc(value) {
  return typeof value === 'string' && ((value.length <= 7_000_000 && /^data:image\\/(?:jpeg|png|webp|gif);base64,[a-z0-9+/]+=*$/i.test(value)) || (isSafeHref(value) && !value.startsWith('#')))
}

function validateSectionContent(section, initialSection) {
  const content = section.content
  if (!content || typeof content.title !== 'string' || !content.title.trim() || typeof content.body !== 'string' || !content.body.trim())
    throw new Error('Le titre et le texte de chaque section sont obligatoires.')
  for (const group of ['items', 'images', 'questions', 'links']) {
    const initialList = initialSection.content[group]
    if (initialList && (!Array.isArray(content[group]) || content[group].length !== initialList.length))
      throw new Error('Le CMS ne peut pas modifier le nombre d’éléments.')
  }
  if (content.items?.some((item) => typeof item.title !== 'string' || !item.title.trim() || typeof item.body !== 'string' || !item.body.trim()))
    throw new Error('Chaque carte doit avoir un titre et un texte.')
  if (content.images?.some((image) => typeof image.alt !== 'string' || !image.alt.trim() || !isSafeImageSrc(image.src)))
    throw new Error('Chaque image doit avoir une source et un texte alternatif valides.')
  if (content.questions?.some((item) => typeof item.question !== 'string' || !item.question.trim() || typeof item.answer !== 'string' || !item.answer.trim()))
    throw new Error('Chaque question doit avoir une réponse.')
  if (content.links?.some((link) => typeof link.label !== 'string' || !link.label.trim() || !isSafeHref(link.href)))
    throw new Error('Chaque lien doit avoir un libellé et une destination valides.')
  if (section.sectionType === 'CTA' && (typeof content.actionLabel !== 'string' || !content.actionLabel.trim() || !isSafeHref(content.actionHref)))
    throw new Error('Le CTA doit avoir un libellé et un lien valides.')
  if (section.sectionType === 'Hero' && content.actionHref && (typeof content.actionLabel !== 'string' || !content.actionLabel.trim() || !isSafeHref(content.actionHref)))
    throw new Error('L’action Hero doit avoir un libellé et un lien valides.')
}

export function openContentStore(filename, initialDocument) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true })
  const database = new DatabaseSync(filename)
  database.exec(
    'CREATE TABLE IF NOT EXISTS cms_content (id INTEGER PRIMARY KEY CHECK (id = 1), document TEXT NOT NULL, updated_at TEXT NOT NULL)',
  )
  database
    .prepare('INSERT OR IGNORE INTO cms_content (id, document, updated_at) VALUES (1, ?, ?)')
    .run(JSON.stringify(initialDocument), new Date().toISOString())

  return {
    read() {
      const row = database
        .prepare('SELECT document FROM cms_content WHERE id = 1')
        .get()
      if (!row) throw new Error('Contenu CMS introuvable.')
      return JSON.parse(row.document)
    },
    save(document) {
      if (document.formatVersion !== 1 || document.projectId !== initialDocument.projectId)
        throw new Error('Document CMS incompatible avec ce site.')
      if (!Array.isArray(document.sections) || document.sections.length !== initialDocument.sections.length)
        throw new Error('Le CMS ne peut pas modifier le nombre de sections.')
      const expected = new Map(initialDocument.sections.map((section) => [section.sectionId, section.sectionType]))
      if (document.sections.some((section) => expected.get(section.sectionId) !== section.sectionType))
        throw new Error('Le CMS ne peut pas modifier l’identité des sections.')
      document.sections.forEach((section) => validateSectionContent(section, initialDocument.sections.find((initial) => initial.sectionId === section.sectionId)))
      database
        .prepare('UPDATE cms_content SET document = ?, updated_at = ? WHERE id = 1')
        .run(JSON.stringify(document), new Date().toISOString())
      return this.read()
    },
    close() {
      database.close()
    },
  }
}
`

const productStoreSource = `import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

function isSafeImage(value) {
  if (value === '') return true
  if (typeof value !== 'string' || value !== value.trim()) return false
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\\\')) return true
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' }
  catch { return false }
}

function validateProduct(product) {
  if (!product || typeof product.name !== 'string' || !product.name.trim()) throw new Error('Le nom du produit est obligatoire.')
  if (typeof product.description !== 'string' || !product.description.trim()) throw new Error('La description du produit est obligatoire.')
  if (!Number.isInteger(product.priceCents) || product.priceCents < 0) throw new Error('Le prix doit être un nombre positif de centimes.')
  if (typeof product.currency !== 'string' || !/^[A-Z]{3}$/.test(product.currency)) throw new Error('La devise doit utiliser trois lettres majuscules.')
  if (!isSafeImage(product.image)) throw new Error('L’image du produit est invalide.')
  if (typeof product.published !== 'boolean') throw new Error('L’état du produit est invalide.')
}

export function openProductStore(filename) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true })
  const database = new DatabaseSync(filename)
  database.exec('CREATE TABLE IF NOT EXISTS cms_products (id TEXT PRIMARY KEY, document TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)')
  return {
    list() {
      return database.prepare('SELECT document FROM cms_products ORDER BY created_at, id').all().map((row) => JSON.parse(row.document))
    },
    create(input) {
      const product = { id: randomUUID(), name: input.name, description: input.description, priceCents: input.priceCents, currency: input.currency, image: input.image, published: input.published }
      validateProduct(product)
      const now = new Date().toISOString()
      database.prepare('INSERT INTO cms_products (id, document, created_at, updated_at) VALUES (?, ?, ?, ?)').run(product.id, JSON.stringify(product), now, now)
      return product
    },
    update(id, input) {
      const product = { id, name: input.name, description: input.description, priceCents: input.priceCents, currency: input.currency, image: input.image, published: input.published }
      validateProduct(product)
      const result = database.prepare('UPDATE cms_products SET document = ?, updated_at = ? WHERE id = ?').run(JSON.stringify(product), new Date().toISOString(), id)
      if (result.changes !== 1) throw new Error('Produit introuvable.')
      return product
    },
    remove(id) {
      const result = database.prepare('DELETE FROM cms_products WHERE id = ?').run(id)
      if (result.changes !== 1) throw new Error('Produit introuvable.')
    },
    close() { database.close() },
  }
}
`

const seoStoreSource = `import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

function safeHttpUrl(value, optional = false) {
  if (optional && value === '') return true
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' }
  catch { return false }
}

function validateSeo(settings) {
  if (!settings || typeof settings.title !== 'string' || !settings.title.trim() || settings.title.length > 60) throw new Error('Le titre SEO doit contenir entre 1 et 60 caractères.')
  if (typeof settings.description !== 'string' || !settings.description.trim() || settings.description.length > 160) throw new Error('La description SEO doit contenir entre 1 et 160 caractères.')
  if (!safeHttpUrl(settings.canonical, true)) throw new Error('L’URL canonique doit être une URL http(s) absolue.')
  if (!safeHttpUrl(settings.ogImage, true)) throw new Error('L’image OpenGraph doit être une URL http(s) absolue.')
  if (typeof settings.indexable !== 'boolean') throw new Error('Le réglage d’indexation est invalide.')
}

export function openSeoStore(filename, initialSettings) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true })
  const database = new DatabaseSync(filename)
  database.exec('CREATE TABLE IF NOT EXISTS cms_seo (id INTEGER PRIMARY KEY CHECK (id = 1), document TEXT NOT NULL, updated_at TEXT NOT NULL)')
  database.prepare('INSERT OR IGNORE INTO cms_seo (id, document, updated_at) VALUES (1, ?, ?)').run(JSON.stringify(initialSettings), new Date().toISOString())
  return {
    read() { return JSON.parse(database.prepare('SELECT document FROM cms_seo WHERE id = 1').get().document) },
    save(settings) { validateSeo(settings); database.prepare('UPDATE cms_seo SET document = ?, updated_at = ? WHERE id = 1').run(JSON.stringify(settings), new Date().toISOString()); return this.read() },
    close() { database.close() },
  }
}
`

const cmsServerSource = `import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { createReadStream, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { openContentStore } from './contentStore.mjs'
import { openProductStore } from './productStore.mjs'
import { openSeoStore } from './seoStore.mjs'

const mimeTypes = { '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' }
const imageTypes = { 'image/gif': '.gif', 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }
function sendJson(response, status, value) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(value))
}

async function readJson(request) {
  return JSON.parse((await readBody(request, 8_000_000)).toString('utf8'))
}

async function readBody(request, limit) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > limit) throw new Error('Fichier trop volumineux.')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

function hasImageSignature(buffer, type) {
  if (type === 'image/jpeg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  if (type === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  if (type === 'image/gif') return buffer.subarray(0, 6).toString('ascii') === 'GIF87a' || buffer.subarray(0, 6).toString('ascii') === 'GIF89a'
  if (type === 'image/webp') return buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  return false
}

function samePassword(received, expected) {
  const left = createHash('sha256').update(received).digest()
  const right = createHash('sha256').update(expected).digest()
  return timingSafeEqual(left, right)
}

function escapeXml(value) { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;') }

export function createCmsServer({ databaseFile, initialContent, initialSeo, distDirectory, mediaDirectory = resolve(distDirectory, '..', 'media'), cmsPassword }) {
  if (typeof cmsPassword !== 'string' || cmsPassword.length < 12) throw new Error('CMS_PASSWORD doit contenir au moins 12 caractères.')
  const store = openContentStore(databaseFile, initialContent)
  const products = openProductStore(databaseFile)
  const seo = openSeoStore(databaseFile, initialSeo)
  const sessions = new Set()
  const distRoot = resolve(distDirectory)
  const mediaRoot = resolve(mediaDirectory)
  mkdirSync(mediaRoot, { recursive: true })
  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost')
    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
      try {
        const credentials = await readJson(request)
        if (typeof credentials.password !== 'string' || !samePassword(credentials.password, cmsPassword)) {
          sendJson(response, 401, { error: 'Identifiants invalides.' })
          return
        }
        const token = randomBytes(32).toString('base64url')
        sessions.add(token)
        response.setHeader('set-cookie', 'cms_session=' + token + '; HttpOnly; SameSite=Strict; Path=/api; Max-Age=28800')
        sendJson(response, 200, { authenticated: true })
      } catch {
        sendJson(response, 400, { error: 'Requête invalide.' })
      }
      return
    }
    const session = request.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith('cms_session='))?.slice('cms_session='.length)
    if (url.pathname === '/api/media' && request.method === 'POST') {
      if (!session || !sessions.has(session)) {
        sendJson(response, 401, { error: 'Authentification requise.' })
        return
      }
      try {
        const type = request.headers['content-type']?.split(';')[0]
        const extension = imageTypes[type]
        if (!extension) throw new Error('Format accepté : JPEG, PNG, WebP ou GIF.')
        const image = await readBody(request, 5_000_000)
        if (!hasImageSignature(image, type)) throw new Error('Le contenu du fichier ne correspond pas à une image valide.')
        const filename = randomBytes(16).toString('hex') + extension
        writeFileSync(resolve(mediaRoot, filename), image, { flag: 'wx' })
        sendJson(response, 201, { path: '/media/' + filename })
      } catch (error) {
        sendJson(response, 400, { error: error instanceof Error ? error.message : 'Envoi impossible.' })
      }
      return
    }
    if (url.pathname === '/api/content' && request.method === 'GET') {
      sendJson(response, 200, store.read())
      return
    }
    if (url.pathname === '/api/seo' && request.method === 'GET') { sendJson(response, 200, seo.read()); return }
    if (url.pathname === '/api/admin/seo' && request.method === 'PUT') {
      if (!session || !sessions.has(session)) { sendJson(response, 401, { error: 'Authentification requise.' }); return }
      try { sendJson(response, 200, seo.save(await readJson(request))) }
      catch (error) { sendJson(response, 400, { error: error instanceof Error ? error.message : 'Requête invalide.' }) }
      return
    }
    if (url.pathname === '/robots.txt' && request.method === 'GET') {
      const settings = seo.read()
      const sitemap = settings.canonical ? '\\nSitemap: ' + settings.canonical.replace(/\\/$/, '') + '/sitemap.xml' : ''
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
      response.end(settings.indexable ? 'User-agent: *\\nAllow: /' + sitemap + '\\n' : 'User-agent: *\\nDisallow: /\\n')
      return
    }
    if (url.pathname === '/sitemap.xml' && request.method === 'GET') {
      const settings = seo.read()
      if (!settings.indexable || !settings.canonical) { response.writeHead(404).end(); return }
      response.writeHead(200, { 'content-type': 'application/xml; charset=utf-8' })
      response.end('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + escapeXml(settings.canonical) + '</loc></url></urlset>')
      return
    }
    if (url.pathname === '/api/products' && request.method === 'GET') {
      sendJson(response, 200, products.list().filter((product) => product.published))
      return
    }
    if (url.pathname === '/api/admin/products' && request.method === 'GET') {
      if (!session || !sessions.has(session)) { sendJson(response, 401, { error: 'Authentification requise.' }); return }
      sendJson(response, 200, products.list())
      return
    }
    if (url.pathname === '/api/admin/products' && request.method === 'POST') {
      if (!session || !sessions.has(session)) { sendJson(response, 401, { error: 'Authentification requise.' }); return }
      try { sendJson(response, 201, products.create(await readJson(request))) }
      catch (error) { sendJson(response, 400, { error: error instanceof Error ? error.message : 'Requête invalide.' }) }
      return
    }
    const productId = url.pathname.startsWith('/api/admin/products/') ? decodeURIComponent(url.pathname.slice('/api/admin/products/'.length)) : null
    if (productId && request.method === 'PUT') {
      if (!session || !sessions.has(session)) { sendJson(response, 401, { error: 'Authentification requise.' }); return }
      try { sendJson(response, 200, products.update(productId, await readJson(request))) }
      catch (error) { sendJson(response, 400, { error: error instanceof Error ? error.message : 'Requête invalide.' }) }
      return
    }
    if (productId && request.method === 'DELETE') {
      if (!session || !sessions.has(session)) { sendJson(response, 401, { error: 'Authentification requise.' }); return }
      try { products.remove(productId); response.writeHead(204).end() }
      catch (error) { sendJson(response, 404, { error: error instanceof Error ? error.message : 'Produit introuvable.' }) }
      return
    }
    if (url.pathname === '/api/content' && request.method === 'PUT') {
      if (!session || !sessions.has(session)) {
        sendJson(response, 401, { error: 'Authentification requise.' })
        return
      }
      try {
        sendJson(response, 200, store.save(await readJson(request)))
      } catch (error) {
        sendJson(response, 400, { error: error instanceof Error ? error.message : 'Requête invalide.' })
      }
      return
    }
    if (url.pathname.startsWith('/api/')) {
      sendJson(response, 404, { error: 'Route inconnue.' })
      return
    }
    if (url.pathname.startsWith('/media/')) {
      const target = resolve(mediaRoot, url.pathname.slice('/media/'.length))
      if (!target.startsWith(mediaRoot + sep)) {
        response.writeHead(403).end()
        return
      }
      try {
        if (!statSync(target).isFile()) throw new Error('Média introuvable.')
        response.writeHead(200, { 'content-type': mimeTypes[extname(target)] ?? 'application/octet-stream', 'x-content-type-options': 'nosniff' })
        createReadStream(target).pipe(response)
      } catch {
        response.writeHead(404).end()
      }
      return
    }
    const requested = url.pathname === '/' ? 'index.html' : url.pathname.slice(1)
    let target = resolve(distRoot, requested)
    if (!target.startsWith(distRoot + sep) && target !== distRoot) {
      response.writeHead(403).end()
      return
    }
    try {
      if (!statSync(target).isFile()) target = resolve(distRoot, 'index.html')
    } catch {
      target = resolve(distRoot, 'index.html')
    }
    response.writeHead(200, { 'content-type': mimeTypes[extname(target)] ?? 'application/octet-stream' })
    createReadStream(target).pipe(response)
  })
  return { server, store, products, seo }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const initialContent = JSON.parse(readFileSync(new URL('../src/cms/content.json', import.meta.url), 'utf8'))
  const initialSeo = JSON.parse(readFileSync(new URL('../src/cms/seo.json', import.meta.url), 'utf8'))
  const { server, store, products, seo } = createCmsServer({ databaseFile: resolve('database/site.db'), initialContent, initialSeo, distDirectory: resolve('dist'), mediaDirectory: resolve('media'), cmsPassword: process.env.CMS_PASSWORD })
  const port = Number(process.env.PORT ?? 3000)
  server.listen(port, '127.0.0.1', () => console.log('Site et CMS disponibles sur http://127.0.0.1:' + port))
  process.on('SIGINT', () => server.close(() => { seo.close(); products.close(); store.close(); process.exit(0) }))
}
`

const contentStoreTest = `import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { openContentStore } from '../server/contentStore.mjs'

const initial = JSON.parse(await readFile(new URL('../src/cms/content.json', import.meta.url), 'utf8'))

test('SQLite persists CMS content after closing and reopening the database', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'buildotron-cms-test-'))
  const filename = join(directory, 'site.db')
  try {
    const store = openContentStore(filename, initial)
    const changed = structuredClone(store.read())
    changed.sections[0].content.title = 'Persisted title'
    store.save(changed)
    assert.equal(store.read().sections[0].content.slot, undefined)
    assert.throws(() => store.save({ ...changed, projectId: 'other' }), /incompatible/)
    store.close()

    const reopened = openContentStore(filename, initial)
    assert.equal(reopened.read().sections[0].content.title, 'Persisted title')
    reopened.close()
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
`

const cmsServerTest = `import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { createCmsServer } from '../server/index.mjs'

const initial = JSON.parse(await readFile(new URL('../src/cms/content.json', import.meta.url), 'utf8'))
const initialSeo = JSON.parse(await readFile(new URL('../src/cms/seo.json', import.meta.url), 'utf8'))

test('CMS API reads and persists content while rejecting structure changes', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'buildotron-api-test-'))
  const { server, store, products, seo } = createCmsServer({ databaseFile: join(directory, 'site.db'), initialContent: initial, initialSeo, distDirectory: directory, cmsPassword: 'test-password-123' })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  const base = 'http://127.0.0.1:' + address.port
  try {
    const current = await fetch(base + '/api/content').then((response) => response.json())
    current.sections[0].content.title = 'Saved through API'
    const unauthorized = await fetch(base + '/api/content', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(current) })
    assert.equal(unauthorized.status, 401)
    const login = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: 'test-password-123' }) })
    assert.equal(login.status, 200)
    const cookie = login.headers.get('set-cookie').split(';')[0]
    assert.match(login.headers.get('set-cookie'), /HttpOnly; SameSite=Strict/)
    const imageBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    const upload = await fetch(base + '/api/media', { method: 'POST', headers: { 'content-type': 'image/png', cookie }, body: imageBytes })
    assert.equal(upload.status, 201)
    const uploaded = await upload.json()
    assert.match(uploaded.path, /^\\/media\\/[a-f0-9]{32}\\.png$/)
    const servedImage = await fetch(base + uploaded.path)
    assert.equal(servedImage.status, 200)
    assert.equal(servedImage.headers.get('content-type'), 'image/png')
    const draftProduct = await fetch(base + '/api/admin/products', { method: 'POST', headers: { 'content-type': 'application/json', cookie }, body: JSON.stringify({ name: 'Draft product', description: 'Draft description', priceCents: 999, currency: 'EUR', image: '', published: false }) })
    assert.equal(draftProduct.status, 201)
    const publicDrafts = await fetch(base + '/api/products').then((response) => response.json())
    assert.equal(publicDrafts.length, 0)
    const createdProduct = await fetch(base + '/api/admin/products', { method: 'POST', headers: { 'content-type': 'application/json', cookie }, body: JSON.stringify({ name: 'Test product', description: 'Test description', priceCents: 1299, currency: 'EUR', image: uploaded.path, published: true }) })
    assert.equal(createdProduct.status, 201)
    const product = await createdProduct.json()
    const listedProducts = await fetch(base + '/api/admin/products', { headers: { cookie } }).then((response) => response.json())
    assert.ok(listedProducts.some((item) => item.id === product.id))
    const publicProducts = await fetch(base + '/api/products').then((response) => response.json())
    assert.deepEqual(publicProducts.map((item) => item.id), [product.id])
    const seoSettings = await fetch(base + '/api/seo').then((response) => response.json())
    seoSettings.title = 'Updated SEO title'
    seoSettings.canonical = 'https://example.com/'
    const savedSeo = await fetch(base + '/api/admin/seo', { method: 'PUT', headers: { 'content-type': 'application/json', cookie }, body: JSON.stringify(seoSettings) })
    assert.equal(savedSeo.status, 200)
    assert.equal(seo.read().title, 'Updated SEO title')
    const robots = await fetch(base + '/robots.txt').then((response) => response.text())
    assert.ok(robots.includes('Sitemap: https://example.com/sitemap.xml'))
    const sitemap = await fetch(base + '/sitemap.xml').then((response) => response.text())
    assert.ok(sitemap.includes('<loc>https://example.com/</loc>'))
    const deletedProduct = await fetch(base + '/api/admin/products/' + product.id, { method: 'DELETE', headers: { cookie } })
    assert.equal(deletedProduct.status, 204)
    const saved = await fetch(base + '/api/content', { method: 'PUT', headers: { 'content-type': 'application/json', cookie }, body: JSON.stringify(current) })
    assert.equal(saved.status, 200)
    assert.equal(store.read().sections[0].content.title, 'Saved through API')

    current.sections.pop()
    const refused = await fetch(base + '/api/content', { method: 'PUT', headers: { 'content-type': 'application/json', cookie }, body: JSON.stringify(current) })
    assert.equal(refused.status, 400)

    const incomplete = structuredClone(store.read())
    incomplete.sections[0].content.title = '   '
    const emptyTitle = await fetch(base + '/api/content', { method: 'PUT', headers: { 'content-type': 'application/json', cookie }, body: JSON.stringify(incomplete) })
    assert.equal(emptyTitle.status, 400)

    const invalidLink = structuredClone(store.read())
    const sectionWithLink = invalidLink.sections.find((section) => section.content.links)
    if (sectionWithLink) {
      sectionWithLink.content.links[0].href = 'data:text/html,test'
      const unsafe = await fetch(base + '/api/content', { method: 'PUT', headers: { 'content-type': 'application/json', cookie }, body: JSON.stringify(invalidLink) })
      assert.equal(unsafe.status, 400)
    }
  } finally {
    await new Promise((resolve) => server.close(resolve))
    seo.close()
    products.close()
    store.close()
    await rm(directory, { recursive: true, force: true })
  }
})
`

export function packageName(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'buildotron-site'
  )
}

export function generateReactProject(
  project: GeneratorProject,
): GeneratedProject {
  const structure = {
    formatVersion: project.formatVersion,
    id: project.id,
    name: project.name,
    blueprint: project.blueprint,
    theme: project.theme,
    sections: project.sections.map((section) => ({
      id: section.id,
      type: section.type,
      slot: section.slot,
      override: section.override,
    })),
  }
  const content = createContentDocument(project)
  const seo = {
    title: project.name,
    description: project.sections[0]?.properties.body ?? project.name,
    canonical: '',
    ogImage: '',
    indexable: true,
  }
  return {
    '.gitignore': 'node_modules/\ndist/\ndatabase/*.db\ndatabase/*.db-*\n',
    'package.json': packageTemplate({ packageName: packageName(project.name) }),
    'index.html':
      '<!doctype html>\n<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>' +
      Handlebars.escapeExpression(project.name) +
      '</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n',
    'tsconfig.json':
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            useDefineForClassFields: true,
            lib: ['ES2022', 'DOM', 'DOM.Iterable'],
            allowJs: false,
            skipLibCheck: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            module: 'ESNext',
            moduleResolution: 'Bundler',
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: 'react-jsx',
            types: ['vite/client'],
          },
          include: ['src'],
        },
        null,
        2,
      ) + '\n',
    'vite.config.ts':
      "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({ plugins: [react()] })\n",
    'eslint.config.js': eslintConfig,
    'src/main.tsx':
      "import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\nimport Admin from './cms/Admin'\n\nconst Page = window.location.pathname === '/admin' ? Admin : App\ncreateRoot(document.getElementById('root')!).render(<StrictMode><Page /></StrictMode>)\n",
    'src/App.tsx': appTemplate({ projectName: project.name }),
    'src/sections.tsx': sectionsSource,
    'src/structure.json': JSON.stringify(structure, null, 2) + '\n',
    'src/cms/content.json': JSON.stringify(content, null, 2) + '\n',
    'src/cms/content.ts': cmsContentSource,
    'src/cms/seo.json': JSON.stringify(seo, null, 2) + '\n',
    'src/cms/Admin.tsx': adminSource,
    'server/contentStore.mjs': contentStoreSource,
    'server/index.mjs': cmsServerSource,
    'server/productStore.mjs': productStoreSource,
    'server/seoStore.mjs': seoStoreSource,
    'media/.gitkeep': '',
    'src/styles.css': `:root { font-family: system-ui, sans-serif; color: #1d2935; background: #fff; }\n* { box-sizing: border-box; }\nbody { margin: 0; }\nmain { max-width: 72rem; margin: auto; }\n.section { padding: 4rem 2rem; }\n.section--hero { padding-block: 7rem; background: #eef5ee; }\n.section--navbar, .section--footer { background: #f3f6f5; }\n.cards, .gallery, .faq { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: 1rem; }\n.card { border: 1px solid #d6dfdc; border-radius: .5rem; padding: 1rem; }\n.gallery img { width: 100%; height: 14rem; object-fit: cover; border-radius: .5rem; }\n.links { display: flex; flex-wrap: wrap; gap: 1rem; padding: 0; list-style: none; }\n.action, button { display: inline-block; margin-top: 1rem; padding: .75rem 1rem; color: white; background: #0d7667; border: 0; border-radius: .25rem; cursor: pointer; }\nbutton:disabled { cursor: not-allowed; opacity: .5; }\n.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); }\n.admin { max-width: 56rem; padding: 3rem 1.5rem; }\n.admin__header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }\n.admin__eyebrow { color: #0d7667; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }\n.admin__login { max-width: 24rem; }\n.admin__sections { display: grid; gap: 1.5rem; margin-top: 2rem; }\n.admin__section { display: grid; gap: .5rem; padding: 1.25rem; border: 1px solid #d6dfdc; border-radius: .5rem; }\n.admin__section legend { padding-inline: .5rem; font-weight: 700; }\n.admin__group { display: grid; gap: .5rem; margin-top: 1rem; padding: 1rem; background: #f3f6f5; border-radius: .35rem; }\n.admin__group h2 { margin: 0 0 .25rem; font-size: 1rem; }\n.admin label { margin-top: .5rem; font-weight: 600; }\n.admin input, .admin textarea { width: 100%; padding: .75rem; color: inherit; font: inherit; border: 1px solid #9baaa5; border-radius: .25rem; }\n.admin__file { padding: .4rem; background: white; }\n.admin__file::file-selector-button { margin-right: .75rem; padding: .65rem .9rem; color: white; background: #0d7667; border: 0; border-radius: .25rem; font: inherit; font-weight: 600; cursor: pointer; }\n.admin__file::file-selector-button:hover { background: #095f54; }\n.admin__file:focus-visible { outline: 3px solid #5eead4; outline-offset: 2px; }\n.admin__errors { position: fixed; z-index: 10; top: 1rem; right: 1rem; width: min(28rem, calc(100vw - 2rem)); max-height: calc(100vh - 2rem); overflow: auto; padding: 1rem; color: #7f1d1d; background: #fef2f2; border: 1px solid #fca5a5; border-radius: .5rem; box-shadow: 0 .75rem 2rem rgb(0 0 0 / .2); }\n.admin__errors ul { margin: .75rem 0 0; padding-left: 1.25rem; }\n.admin__errors li + li { margin-top: .5rem; }\n.admin__catalog { margin-top: 4rem; padding-top: 2rem; border-top: 2px solid #d6dfdc; }\n.admin__product { display: grid; gap: .5rem; margin-top: 1.5rem; padding: 1.25rem; background: #f3f6f5; border-radius: .5rem; }\n.admin__check { display: flex; align-items: center; gap: .5rem; }\n.admin__check input { width: auto; }\n.admin__danger { background: #991b1b; }\n.admin__notice { position: fixed; z-index: 11; right: 1rem; bottom: 1rem; width: min(28rem, calc(100vw - 2rem)); margin: 0; padding: 1rem; color: #14532d; background: #f0fdf4; border: 1px solid #86efac; border-radius: .5rem; box-shadow: 0 .75rem 2rem rgb(0 0 0 / .2); font-weight: 600; }\n.admin__status { min-height: 1.5rem; margin-top: 1rem; }\n`,
    'tests/content.test.mjs': contentTest,
    'tests/content-store.test.mjs': contentStoreTest,
    'tests/cms-server.test.mjs': cmsServerTest,
    'README.md': `# ${project.name}\n\nProjet React généré par Buildotron depuis le Blueprint \`${project.blueprint}\`. Node.js 24 ou une version ultérieure est requis.\n\nLe contenu du CMS est stocké dans \`database/site.db\`. Ce fichier local est ignoré par Git. Les images envoyées depuis le CMS sont conservées dans \`media/\` : ce dossier doit être sauvegardé et conservé lors d'un déploiement.\n\n## Développement du site\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Site et CMS local\n\nDéfinir un mot de passe d'au moins 12 caractères avant de démarrer le serveur. Sous PowerShell :\n\n\`\`\`powershell\n$env:CMS_PASSWORD = "remplacer-par-un-secret-long"\nnpm run build\nnpm start\n\`\`\`\n\nLe site est disponible sur \`http://127.0.0.1:3000\` et son administration sur \`http://127.0.0.1:3000/admin\`. Les sessions sont conservées en mémoire et invalidées au redémarrage.\n\n## Vérifications\n\n\`\`\`bash\nnpm run build\nnpm run lint\nnpm test\n\`\`\`\n`,
  }
}
