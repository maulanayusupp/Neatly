import { describe, expect, it } from 'vitest'
import { describeCron, nextRuns } from '../app/utils/cron'

describe('cron', () => {
  it('describes common expressions', () => {
    expect(describeCron('* * * * *').toLowerCase()).toContain('every minute')
    expect(describeCron('0 0 * * *').toLowerCase()).toContain('12:00 am')
  })

  it('returns the requested number of next runs', () => {
    const runs = nextRuns('*/15 * * * *', 5)
    expect(runs).toHaveLength(5)
    expect(runs[0] instanceof Date).toBe(true)
    expect(runs[1]!.getTime()).toBeGreaterThan(runs[0]!.getTime())
  })

  it('throws on an invalid expression', () => {
    expect(() => nextRuns('not a cron', 3)).toThrow()
  })
})
