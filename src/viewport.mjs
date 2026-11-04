export const MIN_SCALE = 0.2
export const MAX_SCALE = 12
export const VIEWER_PAD = 32
export const VIEWER_TOP = 52
export const VIEWER_BOTTOM = 24

const LINE_PX = 16

export function fitScale(viewWidth, viewHeight, svgWidth, svgHeight) {
  const width = Math.max(80, viewWidth - VIEWER_PAD * 2)
  const height = Math.max(80, viewHeight - VIEWER_TOP - VIEWER_BOTTOM)
  if (!(svgWidth > 0) || !(svgHeight > 0)) return 1
  return Math.min(1, width / svgWidth, height / svgHeight)
}

export function wheelFactor(deltaY, deltaMode = 0, viewportHeight = 0) {
  const pixels = deltaMode === 1 ? deltaY * LINE_PX : deltaMode === 2 ? deltaY * viewportHeight : deltaY
  const factor = Math.exp(-pixels * 0.0016)
  return Math.min(2, Math.max(0.5, factor))
}

export function zoomAround(view, factor, x, y, min, max) {
  const scale = Math.min(max, Math.max(min, view.scale * factor))
  if (scale === view.scale) return view
  const ratio = scale / view.scale
  return { scale, x: x - (x - view.x) * ratio, y: y - (y - view.y) * ratio }
}
