import JSZip from 'jszip'
import {
  generateReactProject,
  packageName,
  validateProjectForGeneration,
} from '@buildotron/generator'
import type { Project } from './project'
import type { ProjectAssets } from './projectPackage'

export async function createProjectArchive(
  project: Project,
  assets: ProjectAssets = {},
): Promise<Blob> {
  const issues = validateProjectForGeneration(project)
  if (issues.length > 0) throw new Error(issues.join(' '))

  const zip = new JSZip()
  for (const [path, content] of Object.entries(generateReactProject(project))) {
    zip.file(path, content)
  }
  for (const [path, content] of Object.entries(assets)) {
    zip.file('public' + path, content)
  }
  return zip.generateAsync({ type: 'blob' })
}

export function projectArchiveName(project: Project): string {
  return `${packageName(project.name)}.zip`
}
