export interface PasswordOptions {
  length: number
  lower: boolean
  upper: boolean
  numbers: boolean
  symbols: boolean
  excludeAmbiguous: boolean
}

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?',
}
const AMBIGUOUS = /[il1lo0oiI]/gi

/** Build the character pool for the given options. */
export function buildPool(opts: PasswordOptions): string {
  let pool = ''
  if (opts.lower) pool += SETS.lower
  if (opts.upper) pool += SETS.upper
  if (opts.numbers) pool += SETS.numbers
  if (opts.symbols) pool += SETS.symbols
  if (opts.excludeAmbiguous) pool = pool.replace(AMBIGUOUS, '')
  return pool
}

/** Generate a cryptographically-random password (empty if no set selected). */
export function generatePassword(opts: PasswordOptions): string {
  const pool = buildPool(opts)
  if (!pool || opts.length < 1) return ''
  const values = new Uint32Array(opts.length)
  crypto.getRandomValues(values)
  let out = ''
  for (let i = 0; i < opts.length; i++) {
    out += pool[values[i]! % pool.length]
  }
  return out
}

/** Rough strength score 0–4 from length + character variety. */
export function passwordStrength(pw: string): number {
  if (!pw) return 0
  let variety = 0
  if (/[a-z]/.test(pw)) variety++
  if (/[A-Z]/.test(pw)) variety++
  if (/\d/.test(pw)) variety++
  if (/[^a-z0-9]/i.test(pw)) variety++

  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (variety >= 3) score++
  if (pw.length >= 16 && variety >= 4) score++
  return score
}
