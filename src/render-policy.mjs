export function keptDiagram(previous, source) {
  if (previous === undefined) return undefined
  if (source.startsWith(previous.source) && source.length > previous.source.length) return previous
  return undefined
}

export function createRenderQueue() {
  let tail = Promise.resolve()
  return function enqueue(job) {
    const run = tail.then(job)
    tail = run.then(() => {}, () => {})
    return run
  }
}
