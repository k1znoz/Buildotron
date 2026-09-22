import { parseProjectJson, serializeProject } from './projectJson.ts'
import type { Project } from './project.ts'

export type SectionCheckIssue = { sectionId?: string; message: string }

export function checkSectionsForExport(project: Project): SectionCheckIssue[] {
  let normalized: Project
  try {
    normalized = parseProjectJson(serializeProject(project))
  } catch (error) {
    return [
      {
        message:
          error instanceof Error ? error.message : 'Projet JSON invalide.',
      },
    ]
  }

  if (normalized.sections.length === 0) {
    return [{ message: 'Ajoutez au moins une section au projet.' }]
  }

  const issues: SectionCheckIssue[] = []
  for (const [index, section] of normalized.sections.entries()) {
    const prefix = `Section ${index + 1} (${section.type})`
    if (section.type === 'CTA' && !section.properties.actionHref) {
      issues.push({
        sectionId: section.id,
        message: `${prefix} : renseignez le lien du bouton.`,
      })
    }
    if (section.type === 'Navbar' && !section.properties.links?.length) {
      issues.push({
        sectionId: section.id,
        message: `${prefix} : ajoutez au moins un lien de navigation.`,
      })
    }
    if (section.type === 'Gallery' && !section.properties.images?.length) {
      issues.push({
        sectionId: section.id,
        message: `${prefix} : ajoutez au moins une image.`,
      })
    }
  }
  return issues
}
