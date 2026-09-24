import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isSafeImageSrc } from '../packages/plugin-sdk/src/index.ts'

test('image sources accept supported embedded images and reject active content', () => {
  assert.equal(isSafeImageSrc('data:image/png;base64,iVBORw0KGgo='), true)
  assert.equal(isSafeImageSrc('data:image/jpeg;base64,/9j/4AAQSkZJRg=='), true)
  assert.equal(
    isSafeImageSrc('data:image/svg+xml,<svg onload=alert(1)>'),
    false,
  )
  assert.equal(isSafeImageSrc('data:text/html,test'), false)
})
