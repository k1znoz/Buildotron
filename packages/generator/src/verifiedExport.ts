import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import JSZip from 'jszip'
import { generateReactProject, validateProjectForGeneration } from './index.ts'
import type { GeneratorProject } from './index.ts'

const [, , inputArgument, outputArgument] = process.argv
if (!inputArgument || !outputArgument) {
  throw new Error('Usage: export:verified <project.json> <output.zip>')
}

function runNpm(cwd: string, args: string[]): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    const child =
      process.platform === 'win32'
        ? spawn(
            process.env.ComSpec ?? 'cmd.exe',
            ['/d', '/s', '/c', ['npm', ...args].join(' ')],
            { cwd, stdio: 'inherit' },
          )
        : spawn('npm', args, { cwd, stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolvePromise()
      else reject(new Error(`npm ${args.join(' ')} a échoué (code ${code}).`))
    })
  })
}

const input = resolve(inputArgument)
const output = resolve(outputArgument)
const project = JSON.parse(await readFile(input, 'utf8')) as GeneratorProject
const issues = validateProjectForGeneration(project)
if (issues.length > 0)
  throw new Error(`Export refusé :\n- ${issues.join('\n- ')}`)

const files = generateReactProject(project)
const staging = await mkdtemp(resolve(tmpdir(), 'buildotron-export-'))

try {
  for (const [relativePath, content] of Object.entries(files)) {
    const target = resolve(staging, relativePath)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, content, 'utf8')
  }

  await runNpm(staging, ['install'])
  await runNpm(staging, ['run', 'build'])
  await runNpm(staging, ['run', 'lint'])
  await runNpm(staging, ['test'])

  const zip = new JSZip()
  for (const [relativePath, content] of Object.entries(files)) {
    zip.file(relativePath, content)
  }
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, await zip.generateAsync({ type: 'nodebuffer' }))
  console.log(`Verified export created: ${output}`)
} finally {
  await rm(staging, { recursive: true, force: true })
}
