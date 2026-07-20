import { describe, expect, it } from 'vitest'
import { validateYaml } from '../app/utils/yaml'

describe('yaml', () => {
  it('validates and pretty-prints valid YAML', () => {
    const r = validateYaml('name:   Neatly\nport: 3000\ntags: [a, b]')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.value).toEqual({ name: 'Neatly', port: 3000, tags: ['a', 'b'] })
      expect(r.formatted).toContain('name: Neatly')
      expect(r.formatted).toContain('- a')
    }
  })

  it('reports an error with a line number on invalid YAML', () => {
    const r = validateYaml('foo: bar\n  bad: indent\n:::')
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.message).toBeTruthy()
      expect(r.line).toBeGreaterThan(0)
    }
  })

  it('treats empty input as valid + empty', () => {
    const r = validateYaml('   ')
    expect(r.ok).toBe(true)
    if (r.ok)
      expect(r.formatted).toBe('')
  })
})
