import assert from 'node:assert/strict'
import test from 'node:test'
import { assignKeys, isDiagramSource, sameScan } from './diagram-source.mjs'

test('an equal-length edit is a different scan', () => {
  const before = { mounted: true, blocks: [{ key: 'n#0', source: 'graph TB\n  A-->B' }] }
  const after = { mounted: true, blocks: [{ key: 'n#0', source: 'graph LR\n  A-->C' }] }
  assert.equal(before.blocks[0].source.length, after.blocks[0].source.length)
  assert.equal(sameScan(before, after), false)
})

test('a diagram inserted under another owner keeps existing keys', () => {
  const before = assignKeys([
    { owner: 'm1', source: 'graph TB\nA-->B' },
    { owner: 'm2', source: 'sequenceDiagram\nAlice->>Bob: hi' },
  ])
  const after = assignKeys([
    { owner: 'm0', source: 'pie\n  "a": 1' },
    { owner: 'm1', source: 'graph TB\nA-->B' },
    { owner: 'm2', source: 'sequenceDiagram\nAlice->>Bob: hi' },
  ])
  assert.deepEqual(before.map(block => block.key), ['m1#0', 'm2#0'])
  assert.deepEqual(after.map(block => block.key), ['m0#0', 'm1#0', 'm2#0'])
})

test('two diagrams in one owner stay ordered', () => {
  const blocks = assignKeys([
    { owner: 'm1', source: 'graph TB\nA-->B' },
    { owner: 'm1', source: 'graph LR\nA-->B' },
  ])
  assert.deepEqual(blocks.map(block => block.key), ['m1#0', 'm1#1'])
})

test('graph and flowchart need a direction; info is not a diagram', () => {
  assert.equal(isDiagramSource('graph\nA-->B'), false)
  assert.equal(isDiagramSource('flowchart\nA-->B'), false)
  assert.equal(isDiagramSource('graph TB\nA-->B'), true)
  assert.equal(isDiagramSource('info'), false)
})

test('the engine keywords the page used to miss are diagrams, and zenuml is not', () => {
  for (const source of [
    'swimlane-beta\nlane',
    'flowchart-elk TB\nA-->B',
    'wardley-beta\ntitle Map',
    'xychart\nx-axis',
    'sankey\nA,B,10',
    'packet\n',
    'block\n',
    'architecture\n',
    'treemap\n',
    'requirement one',
    'ishikawa\n',
    'venn-beta\n',
    'cynefin-beta\n',
    'railroad-beta\n',
    'xychart-beta\n',
  ]) {
    assert.equal(isDiagramSource(source), true, source)
  }
  assert.equal(isDiagramSource('zenuml\nA.method()'), false)
})
