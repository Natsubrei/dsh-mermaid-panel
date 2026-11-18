/**
 * Diagram-start keywords whose first line is unambiguous on its own.
 * The optional suffixes match Mermaid 11.17.2's detectors. `info` is omitted
 * on purpose: the word is common and the engine's detector would claim it.
 * `zenuml` is not a detector in that engine.
 */
const LOOSE_START = /^(?:sequenceDiagram|classDiagram(?:-v2)?|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie|quadrantChart|requirement(?:Diagram)?|gitGraph|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment|mindmap|timeline|xychart(?:-beta)?|block(?:-beta)?|packet(?:-beta)?|kanban|architecture(?:-beta)?|sankey(?:-beta)?|radar-beta|treemap(?:-beta)?|flowchart-elk|swimlane-beta|wardley-beta|ishikawa(?:-beta)?|venn-beta|cynefin-beta|railroad(?:-ebnf|-abnf|-peg)?-beta)\b/

/**
 * Flow directions are the part of `graph`/`flowchart` that makes the keyword a
 * diagram and not a variable name, so they are required.
 */
const FLOW_START = /^(?:graph|flowchart)\s+(?:TB|TD|BT|RL|LR)\b/

function lineAt(source, start) {
  const end = source.indexOf('\n', start)
  if (end === -1) return { text: source.slice(start), next: source.length }
  return { text: source.slice(start, end), next: end + 1 }
}

function declarationLine(source) {
  let start = 0
  const first = lineAt(source, 0)
  if (first.text.trim() === '---') {
    let at = first.next
    while (at < source.length) {
      const line = lineAt(source, at)
      if (line.text.trim() === '---') {
        start = line.next
        break
      }
      at = line.next
    }
  }
  while (start < source.length) {
    const line = lineAt(source, start)
    const text = line.text.trim()
    if (text !== '' && !text.startsWith('%%')) return text
    start = line.next
  }
  return ''
}

export function isDiagramSource(source) {
  const line = declarationLine(source)
  return line !== '' && (FLOW_START.test(line) || LOOSE_START.test(line))
}

export function assignKeys(entries) {
  const seen = new Map()
  return entries.map(entry => {
    const owner = entry.owner ?? ''
    const index = seen.get(owner) ?? 0
    seen.set(owner, index + 1)
    return { key: `${owner}#${index}`, source: entry.source }
  })
}

export function sameScan(prev, next) {
  if (prev.mounted !== next.mounted || prev.blocks.length !== next.blocks.length) return false
  for (let i = 0; i < prev.blocks.length; i++) {
    if (prev.blocks[i].key !== next.blocks[i].key) return false
    if (prev.blocks[i].source !== next.blocks[i].source) return false
  }
  return true
}
