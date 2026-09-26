import { parseProjectJson, serializeProject } from './projectJson.ts'
import type { Project } from './project.ts'
import { pluginValidators } from '@buildotron/plugins/validators'

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
    const properties = section.properties
    const issue = pluginValidators[section.type](properties)
    if (issue) {
      issues.push({
        sectionId: section.id,
        message: `${prefix} : ${issue}`,
      })
    }
  }
  return issues
}
