import { describe, expect, it } from 'vitest'
import { contrastRating, contrastRatio, hexToRgb, rgbToHex, rgbToHsl } from '../app/utils/colors'

describe('colors', () => {
  it('parses 6- and 3-digit hex', () => {
    expect(hexToRgb('#6366f1')).toEqual({ r: 99, g: 102, b: 241 })
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
    expect(hexToRgb('nope')).toBeNull()
  })

  it('round-trips rgb <-> hex', () => {
    expect(rgbToHex({ r: 99, g: 102, b: 241 })).toBe('#6366f1')
  })

  it('converts rgb to hsl', () => {
    expect(rgbToHsl({ r: 99, g: 102, b: 241 })).toEqual({ h: 239, s: 84, l: 67 })
  })

  it('computes WCAG contrast + rating', () => {
    const black = { r: 0, g: 0, b: 0 }
    const white = { r: 255, g: 255, b: 255 }
    expect(Math.round(contrastRatio(black, white))).toBe(21)
    expect(contrastRating(21)).toBe('AAA')
    expect(contrastRating(1)).toBe('Fail')
  })
})
