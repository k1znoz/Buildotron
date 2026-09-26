import { useEffect, useMemo, useState } from 'react'
import { Canvas } from './components/Canvas'
import { Inspector } from './components/Inspector'
import { Library } from './components/Library'
import { Toolbar } from './components/Toolbar'
import {
  createProjectFromBlueprint,
  createSection,
  initialProject,
} from './project'
import {
  duplicateSection,
  moveSection,
  moveSectionBy,
  setSectionOverride,
} from './projectActions'
import {
  maxProjectJsonBytes,
  parseProjectJson,
  serializeProject,
} from './projectJson'
import { checkSectionsForExport } from './sectionChecks'
import { createProjectArchive, projectArchiveName } from './projectExport'
import {
  createBuilderProjectArchive,
  openBuilderProject,
  projectPackageName,
} from './projectPackage'
import type { ProjectAssets } from './projectPackage'
import type { Project, SectionType, Slot } from './project'
import { blueprints } from '../../../blueprints/index.ts'
import type { BlueprintId } from '../../../blueprints/index.ts'
import './App.css'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  // The save dialog may stay open longer than a timer. Keep the Blob until the page closes.
  window.addEventListener('pagehide', () => URL.revokeObjectURL(url), {
    once: true,
  })
}

function App() {
  const [project, setProject] = useState<Project>(initialProject)
  const [selectedId, setSelectedId] = useState<string | null>(
    initialProject.sections[0].id,
  )
  const [message, setMessage] = useState('')
  const [showSectionChecks, setShowSectionChecks] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [assets, setAssets] = useState<ProjectAssets>({})
  const [assetPreviews, setAssetPreviews] = useState<Record<string, string>>({})
  useEffect(() => {
    if (!message) return
    const timeout = window.setTimeout(() => setMessage(''), 3500)
    return () => window.clearTimeout(timeout)
  }, [message])

  const messageIsError =
    /refus|problème|format accepté|moins de|invalide|trop volumineu|activez/i.test(
      message,
    )
  const sectionIssues = showSectionChecks
    ? checkSectionsForExport(project)
    : null
  const selected =
    project.sections.find((section) => section.id === selectedId) ?? null
  const previewProject = useMemo(
    () => ({
      ...project,
      sections: project.sections.map((section) => ({
        ...section,
        properties: {
          ...section.properties,
          images: section.properties.images?.map((image) => ({
            ...image,
            src: assetPreviews[image.src] ?? image.src,
          })),
        },
      })),
    }),
    [assetPreviews, project],
  )

  function add(type: SectionType) {
    const section = createSection(type)
    setProject((current) => ({
      ...current,
      sections: [...current.sections, section],
    }))
    setSelectedId(section.id)
    setMessage(`${type} ajouté dans ${section.slot}.`)
  }

  function duplicate() {
    if (!selected) return
    const copyId = crypto.randomUUID()
    setProject((current) => duplicateSection(current, selected.id, copyId))
    setSelectedId(copyId)
    setMessage(`${selected.type} dupliqué.`)
  }

  function remove() {
    if (!selected) return
    setProject((current) => ({
      ...current,
      sections: current.sections.filter(
        (section) => section.id !== selected.id,
      ),
    }))
    setSelectedId(null)
    setMessage(`${selected.type} supprimé.`)
  }

  function move(id: string, targetSlot: Slot, targetId?: string) {
    const source = project.sections.find((section) => section.id === id)
    if (!source || source.id === targetId) return
    const result = moveSection(project, id, targetSlot, targetId)
    if (!result) {
      setMessage(
        `Activez l'override pour placer ${source.type} dans ${targetSlot}.`,
      )
      return
    }
    setProject(result)
    setMessage(`${source.type} déplacé dans ${targetSlot}.`)
  }

  function moveById(id: string, offset: -1 | 1) {
    const section = project.sections.find((item) => item.id === id)
    if (!section) return
    const next = moveSectionBy(project, id, offset)
    if (next === project) return
    setProject(next)
    setSelectedId(id)
    setMessage(
      `${section.type} déplacé ${offset < 0 ? 'vers le haut' : 'vers le bas'}.`,
    )
  }

  function setOverride(enabled: boolean) {
    if (!selected) return
    setProject((current) => setSectionOverride(current, selected.id, enabled))
    setMessage(
      enabled
        ? 'Override activé pour cette section.'
        : 'Override désactivé ; section remise dans son slot par défaut.',
    )
  }

  function setName(name: string) {
    setProject((current) => ({ ...current, name }))
  }

  function setBlueprint(blueprint: BlueprintId) {
    const next = createProjectFromBlueprint(blueprint, project.name, project.id)
    setProject(next)
    setSelectedId(next.sections[0]?.id ?? null)
    setMessage(`Blueprint « ${blueprints[blueprint].name} » appliqué.`)
  }

  function setProperty(
    key: 'title' | 'body' | 'actionLabel' | 'actionHref',
    value: string,
  ) {
    if (!selected) return
    setProject((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === selected.id
          ? { ...section, properties: { ...section.properties, [key]: value } }
          : section,
      ),
    }))
  }

  function updateList(
    name: 'items' | 'images' | 'questions' | 'links' | 'specifications',
    update: (items: Record<string, string>[]) => Record<string, string>[],
  ) {
    if (!selected) return
    setProject((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== selected.id) return section
        const items = section.properties[name]
        return {
          ...section,
          properties: {
            ...section.properties,
            [name]: update(
              Array.isArray(items)
                ? (items as unknown as Record<string, string>[])
                : [],
            ),
          },
        }
      }),
    }))
  }
  function discardAsset(path: string | undefined) {
    if (!path?.startsWith('/assets/')) return
    setAssets((current) => {
      const next = { ...current }
      delete next[path]
      return next
    })
    setAssetPreviews((current) => {
      if (current[path]) URL.revokeObjectURL(current[path])
      const next = { ...current }
      delete next[path]
      return next
    })
  }

  async function save() {
    if (!project.name.trim()) {
      setMessage('Donnez un nom au projet avant de le sauvegarder.')
      return
    }
    try {
      parseProjectJson(serializeProject(project))
      const archive = await createBuilderProjectArchive(project, assets)
      downloadBlob(archive, projectPackageName(project))
    } catch (error) {
      setMessage(
        `Sauvegarde refusée : ${error instanceof Error ? error.message : 'projet invalide'}`,
      )
      return
    }
    setMessage('Paquet projet téléchargé avec project.json et ses assets.')
  }

  async function open(file: File) {
    try {
      if (file.size === 0)
        throw new Error('Le fichier est vide. Enregistrez le projet à nouveau.')
      if (
        file.name.toLowerCase().endsWith('.json') &&
        file.size > maxProjectJsonBytes
      )
        throw new Error('Fichier JSON trop volumineux (maximum 8 Mo).')
      if (file.size > 100_000_000)
        throw new Error('Archive trop volumineuse (maximum 100 Mo).')
      const loaded = await openBuilderProject(file)
      const previews = Object.fromEntries(
        Object.entries(loaded.assets).map(([path, blob]) => [
          path,
          URL.createObjectURL(blob),
        ]),
      )
      setProject(loaded.project)
      setAssets(loaded.assets)
      setAssetPreviews(previews)
      setSelectedId(loaded.project.sections[0]?.id ?? null)
      setMessage(`Projet « ${loaded.project.name} » ouvert.`)
    } catch (error) {
      setMessage(
        `Ouverture refusée : ${error instanceof Error ? error.message : 'erreur inconnue'}`,
      )
    }
  }

  async function exportReact() {
    const issues = checkSectionsForExport(project)
    setShowSectionChecks(true)
    if (issues.length > 0) {
      setMessage(`Export refusé : ${issues.length} problème(s) à corriger.`)
      return
    }

    setExporting(true)
    try {
      const archive = await createProjectArchive(project, assets)
      const url = URL.createObjectURL(archive)
      const link = document.createElement('a')
      link.href = url
      link.download = projectArchiveName(project)
      document.body.append(link)
      link.click()
      link.remove()
      window.addEventListener('pagehide', () => URL.revokeObjectURL(url), {
        once: true,
      })
      setMessage(`Export React « ${link.download} » téléchargé.`)
    } catch (error) {
      setMessage(
        `Export refusé : ${error instanceof Error ? error.message : 'erreur inconnue'}`,
      )
    } finally {
      setExporting(false)
    }
  }

  return (
    <main className="builder-shell" aria-label="Buildotron Builder">
      <Toolbar
        projectName={project.name}
        blueprintName={blueprints[project.blueprint].name}
        onSave={save}
        onOpen={open}
        onCheckSections={() => setShowSectionChecks(true)}
        onExport={exportReact}
        exporting={exporting}
      />
      <div className="builder-workspace">
        <Library onAdd={add} />
        <Canvas
          project={previewProject}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onMove={move}
          onMoveBy={moveById}
        />
        <Inspector
          projectName={project.name}
          blueprint={project.blueprint}
          section={selected}
          onName={setName}
          onBlueprint={setBlueprint}
          onProperty={setProperty}
          onListItem={(name, index, key, value) => {
            const listName = name as
              | 'items'
              | 'images'
              | 'questions'
              | 'links'
              | 'specifications'
            if (listName === 'images' && key === 'src')
              discardAsset(selected?.properties.images?.[index]?.src)
            updateList(listName, (items) =>
              items.map((item, position) =>
                position === index ? { ...item, [key]: value } : item,
              ),
            )
          }}
          onAddListItem={(name, item) =>
            updateList(
              name as
                | 'items'
                | 'images'
                | 'questions'
                | 'links'
                | 'specifications',
              (items) => [...items, item],
            )
          }
          onRemoveListItem={(name, index) => {
            const listName = name as
              | 'items'
              | 'images'
              | 'questions'
              | 'links'
              | 'specifications'
            if (listName === 'images')
              discardAsset(selected?.properties.images?.[index]?.src)
            updateList(listName, (items) =>
              items.filter((_, position) => position !== index),
            )
          }}
          onGalleryFile={(index, file) => {
            discardAsset(selected?.properties.images?.[index]?.src)
            const extension = file.name.split('.').pop()?.toLowerCase() || 'bin'
            const path = '/assets/' + crypto.randomUUID() + '.' + extension
            setAssets((current) => ({ ...current, [path]: file }))
            setAssetPreviews((current) => ({
              ...current,
              [path]: URL.createObjectURL(file),
            }))
            updateList('images', (images) =>
              images.map((image, position) =>
                position === index ? { ...image, src: path } : image,
              ),
            )
            setMessage('Image ajoutée aux assets du projet.')
          }}
          onGalleryFileError={(error) => setMessage(`Image refusée : ${error}`)}
          onDuplicate={duplicate}
          onRemove={remove}
          onMove={move}
          onMoveBy={(offset) => {
            if (selected) moveById(selected.id, offset < 0 ? -1 : 1)
          }}
          onOverride={setOverride}
        />
      </div>
      <div className="builder-feedback">
        {sectionIssues && (
          <section
            className="section-checks"
            aria-labelledby="section-checks-title"
          >
            <h2 id="section-checks-title">Contrôle des sections</h2>
            {sectionIssues.length === 0 ? (
              <p>Aucun problème détecté. Le projet peut être exporté.</p>
            ) : (
              <ul>
                {sectionIssues.map((issue, index) => (
                  <li key={`${issue.sectionId ?? 'project'}-${index}`}>
                    {issue.message}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
        {message && (
          <div
            className={`builder-status ${messageIsError ? 'builder-status--error' : 'builder-status--success'}`}
            role={messageIsError ? 'alert' : 'status'}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  )
}

export default App
