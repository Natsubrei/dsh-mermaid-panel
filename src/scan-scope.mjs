/**
 * Whether a mutation batch can change the sources the page reads.
 *
 * The page observes the whole document because the conversation unmounts and
 * remounts as a new element, so every input, sidebar, and timer change reaches
 * the same callback. A batch that cannot touch the conversation's scroll
 * container schedules no scan.
 * @param records - the batch from the body observer.
 * @param scroll - the current conversation scroll container, or null when none is mounted.
 * @returns whether a scan is needed.
 */
export function scanWorthy(records, scroll) {
  if (scroll === null) return true
  for (const record of records) {
    if (scroll.contains(record.target)) return true
    if (listContainsScroll(record.addedNodes, scroll)) return true
    if (listContainsScroll(record.removedNodes, scroll)) return true
  }
  return false
}

function listContainsScroll(nodes, scroll) {
  for (const node of nodes) {
    if (node === scroll) return true
    if (typeof node.contains === 'function' && node.contains(scroll)) return true
  }
  return false
}
