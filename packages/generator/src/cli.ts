import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { generateReactProject } from './index.ts'
import type { GeneratorProject } from './index.ts'

const [, , inputArgument, outputArgument] = process.argv
if (!inputArgument || !outputArgument) {
  throw new Error('Usage: generate <project.json> <output-directory>')
}

const input = resolve(inputArgument)
const output = resolve(outputArgument)
const project = JSON.parse(await readFile(input, 'utf8')) as GeneratorProject
const files = generateReactProject(project)

for (const [relativePath, content] of Object.entries(files)) {
  const target = resolve(output, relativePath)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content, 'utf8')
}

console.log(`Generated ${Object.keys(files).length} files in ${output}`)
