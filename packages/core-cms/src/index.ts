export type CmsProjectSection = {
  id: string
  type: string
  slot: string
  override: boolean
  properties: Record<string, unknown>
}

export type CmsProject = {
  id: string
  sections: CmsProjectSection[]
}

export type CmsSectionContent = {
  sectionId: string
  sectionType: string
  content: Record<string, unknown>
}

export type CmsContentDocument = {
  formatVersion: 1
  projectId: string
  sections: CmsSectionContent[]
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

export function createContentDocument(project: CmsProject): CmsContentDocument {
  return {
    formatVersion: 1,
    projectId: project.id,
    sections: project.sections.map((section) => ({
      sectionId: section.id,
      sectionType: section.type,
      content: clone(section.properties),
    })),
  }
}

export function updateSectionContent(
  document: CmsContentDocument,
  sectionId: string,
  content: Record<string, unknown>,
): CmsContentDocument {
  if (!document.sections.some((section) => section.sectionId === sectionId))
    throw new Error('Section CMS inconnue.')

  return {
    ...document,
    sections: document.sections.map((section) =>
      section.sectionId === sectionId
        ? { ...section, content: clone(content) }
        : { ...section, content: clone(section.content) },
    ),
  }
}

export function applyContentDocument<T extends CmsProject>(
  project: T,
  document: CmsContentDocument,
): T {
  if (document.formatVersion !== 1 || document.projectId !== project.id)
    throw new Error('Le contenu CMS ne correspond pas à ce projet.')
  if (document.sections.length !== project.sections.length)
    throw new Error('Le CMS ne peut pas modifier le nombre de sections.')

  const contentById = new Map(
    document.sections.map((section) => [section.sectionId, section]),
  )
  const sections = project.sections.map((section) => {
    const editable = contentById.get(section.id)
    if (!editable || editable.sectionType !== section.type)
      throw new Error("Le CMS ne peut pas modifier l'identité des sections.")
    return { ...section, properties: clone(editable.content) }
  })

  if (contentById.size !== project.sections.length)
    throw new Error('Le CMS ne peut pas ajouter ou dupliquer de section.')

  return { ...project, sections }
}
