import { describe, expect, it } from 'vitest'
import { compareJson } from '../shared/utils/json-compare'

describe('compareJson', () => {
  it('reports identical inputs', () => {
    const r = compareJson([
      { label: 'A', value: { a: 1, b: 2 } },
      { label: 'B', value: { a: 1, b: 2 } },
    ])
    expect(r.identical).toBe(true)
    expect(r.diffCount).toBe(0)
  })

  it('detects a differing value and a missing key', () => {
    const r = compareJson([
      { label: 'A', value: { name: 'ann', age: 30, city: 'NYC' } },
      { label: 'B', value: { name: 'ann', age: 31 } },
    ])
    expect(r.identical).toBe(false)
    expect(r.diffCount).toBe(2)
    const city = r.rows.find(row => row.path === 'city')
    expect(city?.cells[1]?.present).toBe(false)
  })

  it('flags the single odd-one-out among three inputs', () => {
    const r = compareJson([
      { label: 'A', value: { role: 'admin' } },
      { label: 'B', value: { role: 'admin' } },
      { label: 'C', value: { role: 'guest' } },
    ])
    const row = r.rows.find(row => row.path === 'role')
    expect(row?.outlierIndex).toBe(2)
  })

  it('treats type mismatches as differences', () => {
    const r = compareJson([
      { label: 'A', value: { id: 3 } },
      { label: 'B', value: { id: '3' } },
    ])
    expect(r.diffCount).toBe(1)
  })
})
