const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'

export interface BaseDef {
  key: string
  base: number
  label: string
}

export const BASES: BaseDef[] = [
  { key: 'dec', base: 10, label: 'Decimal' },
  { key: 'hex', base: 16, label: 'Hexadecimal' },
  { key: 'oct', base: 8, label: 'Octal' },
  { key: 'bin', base: 2, label: 'Binary' },
]

/** Parse a non-negative integer written in `base`, or null if invalid. */
export function parseInBase(input: string, base: number): bigint | null {
  const cleaned = input.trim().toLowerCase().replace(/^0[bxo]/, '').replace(/[\s_]/g, '')
  if (!cleaned) return null
  const b = BigInt(base)
  let value = 0n
  for (const ch of cleaned) {
    const digit = DIGITS.indexOf(ch)
    if (digit < 0 || digit >= base) return null
    value = value * b + BigInt(digit)
  }
  return value
}

/** Format a non-negative integer into the given base. */
export function toBase(value: bigint, base: number): string {
  if (value === 0n) return '0'
  const b = BigInt(base)
  let v = value
  let out = ''
  while (v > 0n) {
    out = DIGITS[Number(v % b)] + out
    v /= b
  }
  return out
}
