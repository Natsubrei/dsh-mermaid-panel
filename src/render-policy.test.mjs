import assert from 'node:assert/strict'
import test from 'node:test'
import { createRenderQueue, keptDiagram } from './render-policy.mjs'

test('a failed render keeps the previous diagram only while the source grows', () => {
  const previous = { svg: '<svg></svg>', source: 'graph TB\nA' }
  assert.equal(keptDiagram(previous, 'graph TB\nA-->B'), previous)
  assert.equal(keptDiagram(previous, 'graph TB\nA'), undefined)
  assert.equal(keptDiagram(previous, 'pie\n  "a": 1'), undefined)
  assert.equal(keptDiagram(undefined, 'graph TB\nA'), undefined)
})

test('queued renders do not overlap', async () => {
  const enqueue = createRenderQueue()
  let active = 0
  let max = 0
  const job = () => {
    active += 1
    max = Math.max(max, active)
    return new Promise(resolve => {
      setTimeout(() => {
        active -= 1
        resolve('ok')
      }, 20)
    })
  }
  const results = await Promise.all([enqueue(job), enqueue(job), enqueue(job)])
  assert.deepEqual(results, ['ok', 'ok', 'ok'])
  assert.equal(max, 1)
})

test('a rejected render does not block the next one', async () => {
  const enqueue = createRenderQueue()
  await assert.rejects(enqueue(() => Promise.reject(new Error('parse'))))
  assert.equal(await enqueue(() => Promise.resolve('next')), 'next')
})
