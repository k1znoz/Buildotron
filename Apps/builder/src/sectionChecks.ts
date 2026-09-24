import { parseProjectJson, serializeProject } from './projectJson.ts'
import type { Project } from './project.ts'
import {
  validateCTAContent,
  validateFAQContent,
  validateFeaturesContent,
  validateFooterContent,
  validateGalleryContent,
  validateHeroContent,
  validateNavbarContent,
} from '@buildotron/plugins/validation'

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
    const issue =
      section.type === 'Hero'
        ? validateHeroContent({
            title: properties.title,
            body: properties.body,
            actionLabel: properties.actionLabel ?? '',
            actionHref: properties.actionHref ?? '',
          })
        : section.type === 'CTA'
          ? validateCTAContent({
              title: properties.title,
              body: properties.body,
              actionLabel: properties.actionLabel ?? '',
              actionHref: properties.actionHref ?? '',
            })
          : section.type === 'Features'
            ? validateFeaturesContent({
                title: properties.title,
                body: properties.body,
                items: properties.items ?? [],
              })
            : section.type === 'Gallery'
              ? validateGalleryContent({
                  title: properties.title,
                  body: properties.body,
                  images: properties.images ?? [],
                })
              : section.type === 'FAQ'
                ? validateFAQContent({
                    title: properties.title,
                    body: properties.body,
                    questions: properties.questions ?? [],
                  })
                : section.type === 'Footer'
                  ? validateFooterContent({
                      title: properties.title,
                      body: properties.body,
                      links: properties.links ?? [],
                    })
                  : validateNavbarContent({
                      title: properties.title,
                      body: properties.body,
                      links: properties.links ?? [],
                    })
    if (issue) {
      issues.push({
        sectionId: section.id,
        message: `${prefix} : ${issue}`,
      })
    }
  }
  return issues
}
