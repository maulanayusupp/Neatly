import { describe, expect, it } from 'vitest'
import { FAQS } from '../app/utils/faqs'
import { ALL_TOOLS } from '../app/utils/tools'

describe('faqs', () => {
  const validPaths = new Set(['/', ...ALL_TOOLS.map(t => t.to)])

  it('keys reference real tool routes', () => {
    for (const path of Object.keys(FAQS))
      expect(validPaths.has(path), `unknown FAQ route: ${path}`).toBe(true)
  })

  it('every entry has a non-empty question and answer', () => {
    for (const [path, items] of Object.entries(FAQS)) {
      expect(items.length, `${path} has no FAQs`).toBeGreaterThan(0)
      for (const f of items) {
        expect(f.q.trim().length, `empty q in ${path}`).toBeGreaterThan(0)
        expect(f.a.trim().length, `empty a in ${path}`).toBeGreaterThan(0)
      }
    }
  })
})
