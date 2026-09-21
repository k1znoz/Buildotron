import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)
const manifest = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'))
const lock = JSON.parse(
  readFileSync(new URL('package-lock.json', root), 'utf8'),
)

test('workspace paths and lockfile preserve exact directory casing', () => {
  for (const pattern of manifest.workspaces) {
    const [directory, wildcard] = pattern.split('/')
    assert.ok(readdirSync(root).includes(directory), `${directory} casing`)
    if (wildcard === '*') {
      for (const name of readdirSync(new URL(`${directory}/`, root))) {
        const workspace = `${directory}/${name}`
        if (existsSync(new URL(`${workspace}/package.json`, root)))
          assert.ok(lock.packages[workspace], `${workspace} lockfile entry`)
      }
    } else {
      assert.ok(lock.packages[directory], `${directory} lockfile entry`)
    }
  }
  assert.ok(lock.packages['Apps/builder'])
  assert.equal(lock.packages['node_modules/builder'].resolved, 'Apps/builder')
})
