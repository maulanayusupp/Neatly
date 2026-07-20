import { describe, expect, it } from 'vitest'
import { parseInBase, toBase } from '../app/utils/number-base'

describe('number-base', () => {
  it('parses across bases', () => {
    expect(parseInBase('255', 10)).toBe(255n)
    expect(parseInBase('ff', 16)).toBe(255n)
    expect(parseInBase('0xff', 16)).toBe(255n)
    expect(parseInBase('11111111', 2)).toBe(255n)
    expect(parseInBase('377', 8)).toBe(255n)
  })

  it('rejects invalid digits', () => {
    expect(parseInBase('2', 2)).toBeNull()
    expect(parseInBase('g', 16)).toBeNull()
    expect(parseInBase('', 10)).toBeNull()
  })

  it('formats across bases', () => {
    expect(toBase(255n, 2)).toBe('11111111')
    expect(toBase(255n, 16)).toBe('ff')
    expect(toBase(0n, 2)).toBe('0')
  })

  it('handles big integers', () => {
    const big = parseInBase('ffffffffffffffff', 16)
    expect(big).toBe(18446744073709551615n)
    expect(toBase(big!, 10)).toBe('18446744073709551615')
  })
})
