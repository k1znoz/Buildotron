import Handlebars from 'handlebars'

export type GeneratorSection = {
  id: string
  type: string
  slot: string
  properties: Record<string, unknown>
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

const appTemplate = Handlebars.compile(`import project from './content.json'
import './styles.css'

type Section = (typeof project.sections)[number]

function SectionView({ section }: { section: Section }) {
  const content = section.properties
  return (
    <section className={'section section--' + section.type.toLowerCase()} id={section.id}>
      <p className="section__type">{section.type}</p>
      <h2>{content.title}</h2>
      <p>{content.body}</p>
      {'items' in content && Array.isArray(content.items) && (
        <div className="cards">
          {content.items.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3><p>{item.body}</p>
            </article>
          ))}
        </div>
      )}
      {'actionHref' in content && content.actionHref && (
        <a className="action" href={content.actionHref}>{content.actionLabel}</a>
      )}
    </section>
  )
}

export default function App() {
  return (
    <main>
      <h1 className="visually-hidden">{{projectName}}</h1>
      {project.sections.map((section) => <SectionView key={section.id} section={section} />)}
    </main>
  )
}
`)

const packageTemplate = Handlebars.compile(`{
  "name": "{{packageName}}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^6.1.0",
    "vite": "^8.2.2",
    "typescript": "~6.0.2",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4"
  },
  "devDependencies": {}
}
`)

function packageName(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'buildotron-site'
  )
}

export function generateReactProject(project: GeneratorProject): GeneratedProject {
  return {
    'package.json': packageTemplate({ packageName: packageName(project.name) }),
    'index.html': '<!doctype html>\n<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>' + Handlebars.escapeExpression(project.name) + '</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n',
    'tsconfig.json': JSON.stringify({ compilerOptions: { target: 'ES2022', useDefineForClassFields: true, lib: ['ES2022', 'DOM', 'DOM.Iterable'], allowJs: false, skipLibCheck: true, esModuleInterop: true, allowSyntheticDefaultImports: true, strict: true, forceConsistentCasingInFileNames: true, module: 'ESNext', moduleResolution: 'Bundler', resolveJsonModule: true, isolatedModules: true, noEmit: true, jsx: 'react-jsx' }, include: ['src'] }, null, 2) + '\n',
    'vite.config.ts': "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({ plugins: [react()] })\n",
    'src/main.tsx': "import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\n\ncreateRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)\n",
    'src/App.tsx': appTemplate({ projectName: project.name }),
    'src/content.json': JSON.stringify(project, null, 2) + '\n',
    'src/styles.css': `:root { font-family: system-ui, sans-serif; color: #1d2935; background: #fff; }\n* { box-sizing: border-box; }\nbody { margin: 0; }\nmain { max-width: 72rem; margin: auto; }\n.section { padding: 4rem 2rem; }\n.section--hero { padding-block: 7rem; background: #eef5ee; }\n.section__type { color: #667482; font-size: .75rem; text-transform: uppercase; }\n.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: 1rem; }\n.card { border: 1px solid #d6dfdc; border-radius: .5rem; padding: 1rem; }\n.action { display: inline-block; margin-top: 1rem; padding: .75rem 1rem; color: white; background: #0d7667; border-radius: .25rem; }\n.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); }\n`,
    'README.md': `# ${project.name}\n\nProjet React généré par Buildotron depuis le Blueprint \`${project.blueprint}\`.\n\n## Démarrage\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Build\n\n\`\`\`bash\nnpm run build\n\`\`\`\n`,
  }
}
