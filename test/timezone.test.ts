import { describe, expect, it } from 'vitest'
import {
  allTimeZones,
  formatInZone,
  offsetLabel,
  toInputValue,
  wallParts,
  zoneOffsetMinutes,
  zonedWallTimeToEpoch,
} from '../app/utils/timezone'

describe('timezone offsets', () => {
  it('reports fixed offsets (Jakarta = UTC+7)', () => {
    expect(zoneOffsetMinutes(Date.UTC(2026, 0, 1), 'Asia/Jakarta')).toBe(420)
    expect(zoneOffsetMinutes(Date.UTC(2026, 6, 1), 'Asia/Jakarta')).toBe(420)
  })

  it('handles DST for America/New_York', () => {
    expect(zoneOffsetMinutes(Date.UTC(2026, 0, 1), 'America/New_York')).toBe(-300) // EST
    expect(zoneOffsetMinutes(Date.UTC(2026, 6, 1), 'America/New_York')).toBe(-240) // EDT
  })

  it('formats offset labels', () => {
    expect(offsetLabel(420)).toBe('GMT+07:00')
    expect(offsetLabel(-300)).toBe('GMT-05:00')
    expect(offsetLabel(0)).toBe('GMT+00:00')
    expect(offsetLabel(330)).toBe('GMT+05:30')
  })
})

describe('timezone conversion', () => {
  it('converts a wall-clock time in a zone to the correct UTC instant', () => {
    // Noon in Jakarta (UTC+7) is 05:00 UTC.
    const epoch = zonedWallTimeToEpoch({ year: 2026, month: 1, day: 1, hour: 12, minute: 0 }, 'Asia/Jakarta')
    expect(epoch).toBe(Date.UTC(2026, 0, 1, 5, 0))
  })

  it('round-trips wall parts across zones', () => {
    const epoch = zonedWallTimeToEpoch({ year: 2026, month: 7, day: 1, hour: 9, minute: 30 }, 'Europe/London') // BST = UTC+1
    // 09:30 London (summer) -> 08:30 UTC -> 15:30 Jakarta
    expect(wallParts(epoch, 'UTC').hour).toBe(8)
    expect(wallParts(epoch, 'Asia/Jakarta').hour).toBe(15)
    expect(wallParts(epoch, 'Asia/Jakarta').minute).toBe(30)
  })

  it('produces a datetime-local input value in a zone', () => {
    const epoch = Date.UTC(2026, 6, 21, 12, 0)
    expect(toInputValue(epoch, 'UTC')).toBe('2026-07-21T12:00')
    expect(toInputValue(epoch, 'Asia/Jakarta')).toBe('2026-07-21T19:00')
  })

  it('formats an instant in a zone', () => {
    const out = formatInZone(Date.UTC(2026, 6, 21, 5, 0), 'Asia/Jakarta', 'en')
    expect(out).toContain('12:00')
    expect(out).toContain('2026')
  })

  it('exposes a non-empty time zone list', () => {
    const zones = allTimeZones()
    expect(zones.length).toBeGreaterThan(10)
    expect(zones).toContain('UTC')
  })
})
