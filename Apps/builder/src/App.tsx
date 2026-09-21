import { useState } from 'react'
import { Canvas } from './components/Canvas'
import { Inspector } from './components/Inspector'
import { Library } from './components/Library'
import { Toolbar } from './components/Toolbar'
import { createSection, initialProject } from './project'
import {
  duplicateSection,
  moveSection,
  moveSectionBy,
  setSectionOverride,
} from './projectActions'
import { parseProjectJson, serializeProject } from './projectJson'
import type { Project, SectionType, Slot } from './project'
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
      <Toolbar projectName={project.name} onSave={save} onOpen={open} />
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
          section={selected}
          onName={setName}
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
          onDuplicate={duplicate}
          onRemove={remove}
          onMove={move}
          onMoveBy={(offset) => {
            if (selected) moveById(selected.id, offset < 0 ? -1 : 1)
          }}
          onOverride={setOverride}
        />
      </div>
      <div className="builder-status" role="status">
        {message}
      </div>
    </main>
  )
}

export default App
