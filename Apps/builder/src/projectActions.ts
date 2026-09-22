import { defaultSlot } from './project.ts'
import type { Project, Slot } from './project.ts'

export function duplicateSection(
  project: Project,
  id: string,
  copyId: string,
): Project {
  const index = project.sections.findIndex((section) => section.id === id)
  if (index < 0 || project.sections.some((section) => section.id === copyId))
    return project
  const sections = [...project.sections]
  const source = sections[index]
  sections.splice(index + 1, 0, {
    ...source,
    id: copyId,
    properties: {
      ...source.properties,
      ...(source.properties.items
        ? { items: source.properties.items.map((item) => ({ ...item })) }
        : {}),
      ...(source.properties.images
        ? { images: source.properties.images.map((image) => ({ ...image })) }
        : {}),
      ...(source.properties.questions
        ? {
            questions: source.properties.questions.map((item) => ({ ...item })),
          }
        : {}),
    },
  })
  return { ...project, sections }
}

export function moveSection(
  project: Project,
  id: string,
  targetSlot: Slot,
  beforeId?: string,
): Project | null {
  const source = project.sections.find((section) => section.id === id)
  if (!source) return null
  if (source.id === beforeId) return project
  if (targetSlot !== defaultSlot[source.type] && !source.override) return null
  if (
    beforeId &&
    !project.sections.some(
      (section) => section.id === beforeId && section.slot === targetSlot,
    )
  )
    return null

  const sections = project.sections.filter((section) => section.id !== id)
  const index = beforeId
    ? sections.findIndex((section) => section.id === beforeId)
    : -1
  sections.splice(index < 0 ? sections.length : index, 0, {
    ...source,
    slot: targetSlot,
  })
  return { ...project, sections }
}

export function insertionBeforeId(
  project: Project,
  draggedId: string,
  targetId: string,
  lowerHalf: boolean,
): string | undefined {
  const target = project.sections.find((section) => section.id === targetId)
  if (!target) return undefined
  const peers = project.sections.filter(
    (section) => section.slot === target.slot,
  )
  const sourceIndex = peers.findIndex((section) => section.id === draggedId)
  const targetIndex = peers.findIndex((section) => section.id === targetId)
  const afterTarget = sourceIndex >= 0 ? sourceIndex < targetIndex : lowerHalf
  return afterTarget ? peers[targetIndex + 1]?.id : targetId
}

export function moveSectionBy(
  project: Project,
  id: string,
  offset: -1 | 1,
): Project {
  const source = project.sections.find((section) => section.id === id)
  if (!source) return project
  const peers = project.sections.filter(
    (section) => section.slot === source.slot,
  )
  const position = peers.findIndex((section) => section.id === id)
  const target = peers[position + offset]
  if (!target) return project
  const sections = [...project.sections]
  const from = sections.findIndex((section) => section.id === id)
  const to = sections.findIndex((section) => section.id === target.id)
  ;[sections[from], sections[to]] = [sections[to], sections[from]]
  return { ...project, sections }
}

export function setSectionOverride(
  project: Project,
  id: string,
  enabled: boolean,
): Project {
  return {
    ...project,
    sections: project.sections.map((section) =>
      section.id === id
        ? {
            ...section,
            slot: enabled ? section.slot : defaultSlot[section.type],
            override: enabled,
          }
        : section,
    ),
  }
}
