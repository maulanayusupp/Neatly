export interface WallParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

/** A curated fallback list used when Intl.supportedValuesOf is unavailable. */
export const COMMON_TIMEZONES = [
  'UTC',
  'Pacific/Honolulu',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Africa/Cairo',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Jakarta',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
]

/** All IANA time zones the runtime knows about (falls back to a curated list). */
export function allTimeZones(): string[] {
  const withValues = Intl as unknown as { supportedValuesOf?: (k: string) => string[] }
  let zones: string[]
  try {
    zones = withValues.supportedValuesOf ? withValues.supportedValuesOf('timeZone') : COMMON_TIMEZONES
  }
  catch {
    zones = COMMON_TIMEZONES
  }
  // The runtime list may omit plain 'UTC' — always offer it, first.
  return zones.includes('UTC') ? zones : ['UTC', ...zones]
}

/** The wall-clock components of an instant as seen in a given time zone. */
export function wallParts(epochMs: number, timeZone: string): WallParts {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const map: Record<string, number> = {}
  for (const part of dtf.formatToParts(new Date(epochMs))) {
    if (part.type !== 'literal') map[part.type] = Number(part.value)
  }
  // Some engines render midnight as hour "24"; normalise to 0.
  if (map.hour === 24) map.hour = 0
  return { year: map.year!, month: map.month!, day: map.day!, hour: map.hour!, minute: map.minute!, second: map.second! }
}

/** Offset of a time zone from UTC (in minutes) at the given instant. */
export function zoneOffsetMinutes(epochMs: number, timeZone: string): number {
  const p = wallParts(epochMs, timeZone)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return Math.round((asUtc - epochMs) / 60000)
}

/** Interpret wall-clock parts as a local time in `timeZone` and return the UTC epoch (ms). */
export function zonedWallTimeToEpoch(parts: Omit<WallParts, 'second'> & { second?: number }, timeZone: string): number {
  const guess = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second ?? 0)
  const off1 = zoneOffsetMinutes(guess, timeZone)
  let utc = guess - off1 * 60000
  // Re-check once to settle DST boundaries where the offset changes.
  const off2 = zoneOffsetMinutes(utc, timeZone)
  if (off2 !== off1) utc = guess - off2 * 60000
  return utc
}

/** Format an instant for display in a time zone. */
export function formatInZone(epochMs: number, timeZone: string, locale = 'en'): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(epochMs))
}

/** A datetime-local input value (`YYYY-MM-DDTHH:mm`) for an instant in a zone. */
export function toInputValue(epochMs: number, timeZone: string): string {
  const p = wallParts(epochMs, timeZone)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`
}

/** A friendly UTC-offset label, e.g. `GMT+07:00`. */
export function offsetLabel(minutes: number): string {
  const sign = minutes >= 0 ? '+' : '-'
  const abs = Math.abs(minutes)
  return `GMT${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`
}
