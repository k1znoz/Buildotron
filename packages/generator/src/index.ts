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
  Handlebars.compile(`import structureData from './structure.json'
import contentData from './cms/content.json'
import { applyCmsContent } from './cms/content'
import type { CmsContentDocument, ProjectStructure } from './cms/content'
import { SectionView } from './sections'
import './styles.css'

const project = applyCmsContent(
  structureData as ProjectStructure,
  contentData as CmsContentDocument,
)

export default function App() {
  return (
    <main>
      <h1 className="visually-hidden">{{projectName}}</h1>
      {project.sections.map((section) => <SectionView key={section.id} section={section} />)}
    </main>
  )
}
`)

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

const cmsServerSource = `import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { createReadStream, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { openContentStore } from './contentStore.mjs'

const mimeTypes = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' }
function sendJson(response, status, value) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(value))
}

async function readJson(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 1_000_000) throw new Error('Document trop volumineux.')
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function samePassword(received, expected) {
  const left = createHash('sha256').update(received).digest()
  const right = createHash('sha256').update(expected).digest()
  return timingSafeEqual(left, right)
}

export function createCmsServer({ databaseFile, initialContent, distDirectory, cmsPassword }) {
  if (typeof cmsPassword !== 'string' || cmsPassword.length < 12) throw new Error('CMS_PASSWORD doit contenir au moins 12 caractères.')
  const store = openContentStore(databaseFile, initialContent)
  const sessions = new Set()
  const distRoot = resolve(distDirectory)
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
    if (url.pathname === '/api/content' && request.method === 'GET') {
      sendJson(response, 200, store.read())
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
  return { server, store }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const initialContent = JSON.parse(readFileSync(new URL('../src/cms/content.json', import.meta.url), 'utf8'))
  const { server, store } = createCmsServer({ databaseFile: resolve('database/site.db'), initialContent, distDirectory: resolve('dist'), cmsPassword: process.env.CMS_PASSWORD })
  const port = Number(process.env.PORT ?? 3000)
  server.listen(port, '127.0.0.1', () => console.log('Site et CMS disponibles sur http://127.0.0.1:' + port))
  process.on('SIGINT', () => server.close(() => { store.close(); process.exit(0) }))
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

test('CMS API reads and persists content while rejecting structure changes', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'buildotron-api-test-'))
  const { server, store } = createCmsServer({ databaseFile: join(directory, 'site.db'), initialContent: initial, distDirectory: directory, cmsPassword: 'test-password-123' })
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
    const saved = await fetch(base + '/api/content', { method: 'PUT', headers: { 'content-type': 'application/json', cookie }, body: JSON.stringify(current) })
    assert.equal(saved.status, 200)
    assert.equal(store.read().sections[0].content.title, 'Saved through API')

    current.sections.pop()
    const refused = await fetch(base + '/api/content', { method: 'PUT', headers: { 'content-type': 'application/json', cookie }, body: JSON.stringify(current) })
    assert.equal(refused.status, 400)
  } finally {
    await new Promise((resolve) => server.close(resolve))
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
      "import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\n\ncreateRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)\n",
    'src/App.tsx': appTemplate({ projectName: project.name }),
    'src/sections.tsx': sectionsSource,
    'src/structure.json': JSON.stringify(structure, null, 2) + '\n',
    'src/cms/content.json': JSON.stringify(content, null, 2) + '\n',
    'src/cms/content.ts': cmsContentSource,
    'server/contentStore.mjs': contentStoreSource,
    'server/index.mjs': cmsServerSource,
    'src/styles.css': `:root { font-family: system-ui, sans-serif; color: #1d2935; background: #fff; }\n* { box-sizing: border-box; }\nbody { margin: 0; }\nmain { max-width: 72rem; margin: auto; }\n.section { padding: 4rem 2rem; }\n.section--hero { padding-block: 7rem; background: #eef5ee; }\n.section--navbar, .section--footer { background: #f3f6f5; }\n.cards, .gallery, .faq { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: 1rem; }\n.card { border: 1px solid #d6dfdc; border-radius: .5rem; padding: 1rem; }\n.gallery img { width: 100%; height: 14rem; object-fit: cover; border-radius: .5rem; }\n.links { display: flex; flex-wrap: wrap; gap: 1rem; padding: 0; list-style: none; }\n.action { display: inline-block; margin-top: 1rem; padding: .75rem 1rem; color: white; background: #0d7667; border-radius: .25rem; }\n.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); }\n`,
    'tests/content.test.mjs': contentTest,
    'tests/content-store.test.mjs': contentStoreTest,
    'tests/cms-server.test.mjs': cmsServerTest,
    'README.md': `# ${project.name}\n\nProjet React généré par Buildotron depuis le Blueprint \`${project.blueprint}\`. Node.js 24 ou une version ultérieure est requis.\n\nLe contenu du CMS est stocké dans \`database/site.db\`. Ce fichier local est ignoré par Git.\n\n## Développement du site\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Site et API CMS locale\n\nDéfinir un mot de passe d'au moins 12 caractères avant de démarrer le serveur. Sous PowerShell :\n\n\`\`\`powershell\n$env:CMS_PASSWORD = "remplacer-par-un-secret-long"\nnpm run build\nnpm start\n\`\`\`\n\nLe serveur écoute par défaut sur \`http://127.0.0.1:3000\`. Les sessions sont conservées en mémoire et invalidées au redémarrage.\n\n## Vérifications\n\n\`\`\`bash\nnpm run build\nnpm run lint\nnpm test\n\`\`\`\n`,
  }
}
