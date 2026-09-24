import JSZip from 'jszip'
import { parseProjectJson, serializeProject } from './projectJson.ts'
import type { Project } from './project'

export type ProjectAssets = Record<string, Blob>

export async function createBuilderProjectArchive(
  project: Project,
  assets: ProjectAssets,
): Promise<Blob> {
  const zip = new JSZip()
  zip.file('project.json', serializeProject(project))
  for (const [path, blob] of Object.entries(assets)) {
    zip.file(path.replace(/^\//, ''), blob)
  }
  return zip.generateAsync({ type: 'blob' })
}

export async function openBuilderProject(file: File): Promise<{
  project: Project
  assets: ProjectAssets
}> {
  if (file.name.toLowerCase().endsWith('.json')) {
    return { project: parseProjectJson(await file.text()), assets: {} }
  }
  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  const projectFile = zip.file('project.json')
  if (!projectFile)
    throw new Error('Archive invalide : project.json est absent.')
  const project = parseProjectJson(await projectFile.async('string'))
  const assets: ProjectAssets = {}
  const entries = Object.values(zip.files).filter(
    (entry) => !entry.dir && entry.name.startsWith('assets/'),
  )
  for (const entry of entries)
    assets['/' + entry.name] = await entry.async('blob')
  return { project, assets }
}

export function projectPackageName(project: Project): string {
  const name = project.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return (name || 'buildotron-project') + '.buildotron.zip'
}
