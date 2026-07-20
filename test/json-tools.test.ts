import { describe, expect, it } from 'vitest'
import { jsonStats, parseJson, sortKeysDeep } from '../app/utils/json-tools'

describe('json-tools', () => {
  it('parses valid JSON', () => {
    const r = parseJson('{"a":1}')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value).toEqual({ a: 1 })
  })

  it('reports an error location for invalid JSON', () => {
    const r = parseJson('{\n  "a": 1\n  "b": 2\n}')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.line).toBeGreaterThan(1)
  })

  it('counts keys, nodes and depth', () => {
    const stats = jsonStats({ a: 1, b: { c: 2 } })
    expect(stats.keys).toBe(3)
    expect(stats.depth).toBe(2)
  })

  it('sorts object keys deeply', () => {
    const sorted = sortKeysDeep({ b: 1, a: { d: 1, c: 2 } })
    expect(Object.keys(sorted as object)).toEqual(['a', 'b'])
    expect(Object.keys((sorted as { a: object }).a)).toEqual(['c', 'd'])
  })
})
