import { useState } from 'react'
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
import { parseProjectJson, serializeProject } from './projectJson'
import { checkSectionsForExport } from './sectionChecks'
import type { Project, SectionType, Slot } from './project'
import { blueprints } from '../../../blueprints/index.ts'
import type { BlueprintId } from '../../../blueprints/index.ts'
import './App.css'

function downloadProjectJson(json: string) {
  const url = URL.createObjectURL(
    new Blob([json], { type: 'application/json' }),
  )
  const link = document.createElement('a')
  link.href = url
  link.download = 'product-landing.json'
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
  const sectionIssues = showSectionChecks
    ? checkSectionsForExport(project)
    : null
  const selected =
    project.sections.find((section) => section.id === selectedId) ?? null

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

  function updateFeatureItems(
    update: (
      items: NonNullable<Project['sections'][number]['properties']['items']>,
    ) => NonNullable<Project['sections'][number]['properties']['items']>,
  ) {
    if (!selected || selected.type !== 'Features') return
    setProject((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === selected.id
          ? {
              ...section,
              properties: {
                ...section.properties,
                items: update(section.properties.items ?? []),
              },
            }
          : section,
      ),
    }))
  }

  function updateGalleryImages(
    update: (
      images: NonNullable<Project['sections'][number]['properties']['images']>,
    ) => NonNullable<Project['sections'][number]['properties']['images']>,
  ) {
    if (!selected || selected.type !== 'Gallery') return
    setProject((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === selected.id
          ? {
              ...section,
              properties: {
                ...section.properties,
                images: update(section.properties.images ?? []),
              },
            }
          : section,
      ),
    }))
  }

  function updateFAQItems(
    update: (
      questions: NonNullable<
        Project['sections'][number]['properties']['questions']
      >,
    ) => NonNullable<Project['sections'][number]['properties']['questions']>,
  ) {
    if (!selected || selected.type !== 'FAQ') return
    setProject((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === selected.id
          ? {
              ...section,
              properties: {
                ...section.properties,
                questions: update(section.properties.questions ?? []),
              },
            }
          : section,
      ),
    }))
  }

  function updateFooterLinks(
    update: (
      links: NonNullable<Project['sections'][number]['properties']['links']>,
    ) => NonNullable<Project['sections'][number]['properties']['links']>,
  ) {
    if (!selected || (selected.type !== 'Footer' && selected.type !== 'Navbar'))
      return
    setProject((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === selected.id
          ? {
              ...section,
              properties: {
                ...section.properties,
                links: update(section.properties.links ?? []),
              },
            }
          : section,
      ),
    }))
  }

  function save() {
    if (!project.name.trim()) {
      setMessage('Donnez un nom au projet avant de le sauvegarder.')
      return
    }
    const json = serializeProject(project)
    try {
      parseProjectJson(json)
    } catch (error) {
      setMessage(
        `Sauvegarde refusée : ${error instanceof Error ? error.message : 'projet invalide'}`,
      )
      return
    }
    downloadProjectJson(json)
    setMessage(
      'Téléchargement JSON lancé. Choisissez projects/ dans le navigateur ou déplacez-y le fichier téléchargé.',
    )
  }

  async function open(file: File) {
    try {
      if (file.size === 0)
        throw new Error('Le fichier est vide. Enregistrez le projet à nouveau.')
      if (file.size > 1_000_000)
        throw new Error('Fichier trop volumineux (maximum 1 Mo).')
      const loaded = parseProjectJson(await file.text())
      setProject(loaded)
      setSelectedId(loaded.sections[0]?.id ?? null)
      setMessage(`Projet « ${loaded.name} » ouvert.`)
    } catch (error) {
      setMessage(
        `Ouverture refusée : ${error instanceof Error ? error.message : 'erreur inconnue'}`,
      )
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
      />
      <div className="builder-workspace">
        <Library onAdd={add} />
        <Canvas
          project={project}
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
          onFeatureItem={(index, key, value) =>
            updateFeatureItems((items) =>
              items.map((item, position) =>
                position === index ? { ...item, [key]: value } : item,
              ),
            )
          }
          onAddFeatureItem={() =>
            updateFeatureItems((items) =>
              items.length >= 12
                ? items
                : [
                    ...items,
                    { title: 'New feature', body: 'Describe the benefit.' },
                  ],
            )
          }
          onRemoveFeatureItem={(index) =>
            updateFeatureItems((items) =>
              items.length <= 1
                ? items
                : items.filter((_, position) => position !== index),
            )
          }
          onGalleryImage={(index, key, value) =>
            updateGalleryImages((images) =>
              images.map((image, position) =>
                position === index ? { ...image, [key]: value } : image,
              ),
            )
          }
          onAddGalleryImage={() =>
            updateGalleryImages((images) =>
              images.length >= 12 ? images : [...images, { src: '', alt: '' }],
            )
          }
          onRemoveGalleryImage={(index) =>
            updateGalleryImages((images) =>
              images.filter((_, position) => position !== index),
            )
          }
          onFAQItem={(index, key, value) =>
            updateFAQItems((questions) =>
              questions.map((item, position) =>
                position === index ? { ...item, [key]: value } : item,
              ),
            )
          }
          onAddFAQItem={() =>
            updateFAQItems((questions) =>
              questions.length >= 12
                ? questions
                : [
                    ...questions,
                    { question: 'New question', answer: 'Write the answer.' },
                  ],
            )
          }
          onRemoveFAQItem={(index) =>
            updateFAQItems((questions) =>
              questions.length <= 1
                ? questions
                : questions.filter((_, position) => position !== index),
            )
          }
          onFooterLink={(index, key, value) =>
            updateFooterLinks((links) =>
              links.map((link, position) =>
                position === index ? { ...link, [key]: value } : link,
              ),
            )
          }
          onAddFooterLink={() =>
            updateFooterLinks((links) =>
              links.length >= 12
                ? links
                : [...links, { label: 'New link', href: '' }],
            )
          }
          onRemoveFooterLink={(index) =>
            updateFooterLinks((links) =>
              links.filter((_, position) => position !== index),
            )
          }
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
              <p>
                Aucun problème de section détecté. Le générateur et le CMS
                restent à réaliser.
              </p>
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
        <div className="builder-status" role="status">
          {message}
        </div>
      </div>
    </main>
  )
}

export default App
