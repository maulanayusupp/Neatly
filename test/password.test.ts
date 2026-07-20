import { describe, expect, it } from 'vitest'
import { buildPool, generatePassword, passwordStrength } from '../app/utils/password'

const base = { length: 16, lower: true, upper: true, numbers: true, symbols: true, excludeAmbiguous: false }

describe('password', () => {
  it('generates a password of the requested length', () => {
    expect(generatePassword({ ...base, length: 24 })).toHaveLength(24)
  })

  it('only uses characters from the selected sets', () => {
    const pw = generatePassword({ ...base, lower: false, upper: false, symbols: false })
    expect(pw).toMatch(/^\d+$/)
  })

  it('returns empty when no set is selected', () => {
    expect(generatePassword({ ...base, lower: false, upper: false, numbers: false, symbols: false })).toBe('')
    expect(buildPool({ ...base, lower: false, upper: false, numbers: false, symbols: false })).toBe('')
  })

  it('excludes ambiguous characters when asked', () => {
    const pool = buildPool({ ...base, symbols: false, excludeAmbiguous: true })
    expect(pool).not.toMatch(/[il1O0]/)
  })

  it('rates strength from weak to strong', () => {
    expect(passwordStrength('')).toBe(0)
    expect(passwordStrength('abc')).toBeLessThan(passwordStrength('Abcd1234!@#$xyzQ'))
    expect(passwordStrength('Abcd1234!@#$xyzQ')).toBe(4)
  })
})
