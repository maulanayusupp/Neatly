import { describe, expect, it } from 'vitest'
import { generateLorem, generateParagraph } from '../app/utils/lorem'

describe('lorem', () => {
  it('generates the requested number of paragraphs', () => {
    expect(generateLorem({ paragraphs: 4, wordsPerPara: 40, startWithLorem: true })).toHaveLength(4)
  })

  it('opens the first paragraph with Lorem ipsum when requested', () => {
    const [first] = generateLorem({ paragraphs: 1, wordsPerPara: 30, startWithLorem: true })
    expect(first!.toLowerCase().startsWith('lorem ipsum dolor sit amet')).toBe(true)
  })

  it('respects roughly the requested word count', () => {
    const p = generateParagraph(50)
    const words = p.split(/\s+/).length
    expect(words).toBeGreaterThanOrEqual(50)
    expect(words).toBeLessThan(70)
  })

  it('produces sentences ending in a period', () => {
    expect(generateParagraph(20).trim().endsWith('.')).toBe(true)
  })
})
