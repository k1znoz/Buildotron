import Handlebars from 'handlebars'
import { isSafeHref, isSafeImageSrc } from '@buildotron/plugin-sdk'

export type GeneratorSection = {
  id: string
  type: string
  slot: string
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

const appTemplate = Handlebars.compile(`import projectData from './content.json'
import { SectionView } from './sections'
import type { ProjectContent } from './sections'
import './styles.css'

const project = projectData as ProjectContent

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
type Content = { title: string; body: string; items?: Item[]; images?: Image[]; questions?: Question[]; links?: Link[]; actionLabel?: string; actionHref?: string }
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

const packageTemplate = Handlebars.compile(`{
  "name": "{{packageName}}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
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
const project = JSON.parse(await readFile(new URL('../src/content.json', import.meta.url), 'utf8'))

test('generated content contains only supported sections', () => {
  assert.ok(project.sections.length > 0)
  assert.ok(project.sections.every((section) => supported.has(section.type)))
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
  return {
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
    'src/content.json': JSON.stringify(project, null, 2) + '\n',
    'src/styles.css': `:root { font-family: system-ui, sans-serif; color: #1d2935; background: #fff; }\n* { box-sizing: border-box; }\nbody { margin: 0; }\nmain { max-width: 72rem; margin: auto; }\n.section { padding: 4rem 2rem; }\n.section--hero { padding-block: 7rem; background: #eef5ee; }\n.section--navbar, .section--footer { background: #f3f6f5; }\n.cards, .gallery, .faq { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: 1rem; }\n.card { border: 1px solid #d6dfdc; border-radius: .5rem; padding: 1rem; }\n.gallery img { width: 100%; height: 14rem; object-fit: cover; border-radius: .5rem; }\n.links { display: flex; flex-wrap: wrap; gap: 1rem; padding: 0; list-style: none; }\n.action { display: inline-block; margin-top: 1rem; padding: .75rem 1rem; color: white; background: #0d7667; border-radius: .25rem; }\n.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); }\n`,
    'tests/content.test.mjs': contentTest,
    'README.md': `# ${project.name}\n\nProjet React généré par Buildotron depuis le Blueprint \`${project.blueprint}\`.\n\n## Démarrage\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Vérifications\n\n\`\`\`bash\nnpm run build\nnpm run lint\nnpm test\n\`\`\`\n`,
  }
}
