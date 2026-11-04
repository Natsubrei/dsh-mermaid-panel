import assert from 'node:assert/strict'
import test from 'node:test'
import { fitScale, wheelFactor, zoomAround } from './viewport.mjs'

test('fit uses the ratio that puts a huge diagram in the stage', () => {
  const scale = fitScale(800, 600, 8000, 6000)
  assert.ok(scale < 0.2, `scale ${scale} is still clamped at the zoom floor`)
  assert.ok(Math.abs(scale - 0.0873) < 0.001, `scale ${scale}`)
})

test('fit never scales a small diagram above 1', () => {
  assert.equal(fitScale(800, 600, 100, 80), 1)
})

test('a line-mode notch uses the same pixels as 16 pixels per line', () => {
  assert.equal(wheelFactor(3, 1, 800), wheelFactor(48, 0, 800))
  assert.ok(wheelFactor(3, 1, 800) < 0.95)
})

test('zoom keeps the pointer fixed until a limit', () => {
  const next = zoomAround({ scale: 1, x: 10, y: 20 }, 2, 30, 40, 0.2, 12)
  assert.equal(next.scale, 2)
  assert.equal(next.x, 30 - (30 - 10) * 2)
  assert.equal(next.y, 40 - (40 - 20) * 2)
  const atMax = { scale: 12, x: 0, y: 0 }
  assert.equal(zoomAround(atMax, 2, 0, 0, 0.2, 12), atMax)
})
