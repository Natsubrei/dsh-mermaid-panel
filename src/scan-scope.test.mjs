import assert from 'node:assert/strict'
import test from 'node:test'
import { scanWorthy } from './scan-scope.mjs'

function record(fields) {
  return { target: {}, addedNodes: [], removedNodes: [], ...fields }
}

test('a change inside the conversation schedules a scan', () => {
  const target = {}
  const scroll = { contains: (node) => node === target }
  assert.equal(scanWorthy([record({ target })], scroll), true)
})

test('a batch outside the conversation schedules no scan', () => {
  const scroll = { contains: () => false }
  assert.equal(scanWorthy([record({ target: {} })], scroll), false)
  assert.equal(scanWorthy([], scroll), false)
})

test('a mounted or unmounted conversation schedules a scan', () => {
  const scroll = { contains: () => false }
  const wrapper = { contains: (node) => node === scroll }
  assert.equal(scanWorthy([record({ addedNodes: [wrapper] })], scroll), true)
  assert.equal(scanWorthy([record({ removedNodes: [wrapper] })], scroll), true)
  assert.equal(scanWorthy([record({ addedNodes: [scroll] })], scroll), true)
})

test('no mounted conversation schedules a scan', () => {
  assert.equal(scanWorthy([record({})], null), true)
})
