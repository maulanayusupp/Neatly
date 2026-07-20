export interface JsonParseError {
  message: string
  line: number
  column: number
}

export type JsonParseResult =
  | { ok: true, value: unknown }
  | { ok: false, error: JsonParseError }

/** Parse JSON, returning a 1-based error location on failure. */
export function parseJson(code: string): JsonParseResult {
  try {
    return { ok: true, value: JSON.parse(code) }
  }
  catch (error) {
    const message = (error as Error).message
    let line = 1
    let column = 1
    const pos = message.match(/position (\d+)/)
    const lineCol = message.match(/line (\d+) column (\d+)/)
    if (lineCol) {
      line = Number(lineCol[1])
      column = Number(lineCol[2])
    }
    else if (pos) {
      const offset = Number(pos[1])
      const upto = code.slice(0, offset)
      line = upto.split('\n').length
      column = offset - upto.lastIndexOf('\n')
    }
    return { ok: false, error: { message, line, column } }
  }
}

export interface JsonStats {
  keys: number
  nodes: number
  depth: number
}

/** Count total keys, nodes and maximum nesting depth. */
export function jsonStats(value: unknown): JsonStats {
  let keys = 0
  let nodes = 0
  let depth = 0
  function walk(node: unknown, level: number) {
    nodes++
    if (level > depth) depth = level
    if (Array.isArray(node)) {
      node.forEach(item => walk(item, level + 1))
    }
    else if (node && typeof node === 'object') {
      for (const key of Object.keys(node)) {
        keys++
        walk((node as Record<string, unknown>)[key], level + 1)
      }
    }
  }
  walk(value, 0)
  return { keys, nodes, depth }
}

/** Recursively sort object keys alphabetically (arrays keep order). */
export function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep)
  if (value && typeof value === 'object') {
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortKeysDeep((value as Record<string, unknown>)[key])
    }
    return sorted
  }
  return value
}
