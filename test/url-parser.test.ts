import { describe, expect, it } from 'vitest'
import { buildQuery, buildUrl, parseUrl } from '../app/utils/url-parser'

describe('url-parser', () => {
  it('parses a full URL into parts and params', () => {
    const p = parseUrl('https://user:pass@example.com:8080/a/b?q=hello%20world&lang=id#frag')
    expect(p.valid).toBe(true)
    expect(p.protocol).toBe('https:')
    expect(p.hostname).toBe('example.com')
    expect(p.port).toBe('8080')
    expect(p.pathname).toBe('/a/b')
    expect(p.hash).toBe('#frag')
    expect(p.username).toBe('user')
    expect(p.params).toEqual([{ key: 'q', value: 'hello world' }, { key: 'lang', value: 'id' }])
  })

  it('prefixes https:// when no scheme is given', () => {
    const p = parseUrl('example.com/path?x=1')
    expect(p.valid).toBe(true)
    expect(p.protocol).toBe('https:')
    expect(p.hostname).toBe('example.com')
  })

  it('flags invalid input', () => {
    expect(parseUrl('http://').valid).toBe(false)
    expect(parseUrl('').valid).toBe(false)
  })

  it('builds a query string with encoding', () => {
    expect(buildQuery([{ key: 'q', value: 'a b' }, { key: 'x', value: '1&2' }])).toBe('q=a+b&x=1%262')
    expect(buildQuery([{ key: '', value: 'skip' }, { key: 'ok', value: '1' }])).toBe('ok=1')
  })

  it('rebuilds a URL from edited params', () => {
    const p = parseUrl('https://example.com/s?a=1')
    const out = buildUrl(p, [{ key: 'a', value: '2' }, { key: 'b', value: 'x y' }])
    expect(out).toBe('https://example.com/s?a=2&b=x+y')
  })
})
