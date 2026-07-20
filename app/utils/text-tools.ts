export interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  lines: number
  sentences: number
  paragraphs: number
  readingSeconds: number
}

/** Word/line/character statistics for a block of text. */
export function textStats(text: string): TextStats {
  const words = (text.match(/\S+/g) || []).length
  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words,
    lines: text === '' ? 0 : text.split('\n').length,
    sentences: (text.match(/[^.!?…]+[.!?…]+(\s|$)/g) || []).length || (text.trim() ? 1 : 0),
    paragraphs: text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).length,
    readingSeconds: Math.round((words / 200) * 60),
  }
}

const lines = (text: string) => text.split('\n')

/** Sort lines alphabetically (natural, case-insensitive). */
export function sortLines(text: string, dir: 'asc' | 'desc' = 'asc'): string {
  const out = lines(text).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }))
  if (dir === 'desc') out.reverse()
  return out.join('\n')
}

/** Remove duplicate lines, keeping the first occurrence. */
export function uniqueLines(text: string): string {
  const seen = new Set<string>()
  return lines(text).filter(l => (seen.has(l) ? false : seen.add(l))).join('\n')
}

export function reverseLines(text: string): string {
  return lines(text).reverse().join('\n')
}

/** Trim leading/trailing whitespace on each line. */
export function trimLines(text: string): string {
  return lines(text).map(l => l.trim()).join('\n')
}

export function removeEmptyLines(text: string): string {
  return lines(text).filter(l => l.trim() !== '').join('\n')
}

/** Collapse runs of whitespace within each line to a single space + trim. */
export function collapseSpaces(text: string): string {
  return lines(text).map(l => l.replace(/\s+/g, ' ').trim()).join('\n')
}

export function reverseText(text: string): string {
  return [...text].reverse().join('')
}

/** Prefix each line with a right-aligned line number. */
export function addLineNumbers(text: string, start = 1): string {
  const rows = lines(text)
  const width = String(rows.length + start - 1).length
  return rows.map((l, i) => `${String(i + start).padStart(width, ' ')}  ${l}`).join('\n')
}

export function toUpperCase(text: string): string {
  return text.toUpperCase()
}

export function toLowerCase(text: string): string {
  return text.toLowerCase()
}

/** Capitalise the first letter of every word. */
export function toTitleCase(text: string): string {
  return text.replace(/\S+/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

/** Capitalise the first letter of every sentence. */
export function toSentenceCase(text: string): string {
  return text.toLowerCase().replace(/(^\s*\p{L})|([.!?…]\s+\p{L})/gu, c => c.toUpperCase())
}

export interface ReplaceOptions {
  regex?: boolean
  caseInsensitive?: boolean
}

/** Find & replace all occurrences. Throws on an invalid regex pattern. */
export function findReplace(text: string, find: string, replace: string, opts: ReplaceOptions = {}): string {
  if (!find) return text
  const flags = `g${opts.caseInsensitive ? 'i' : ''}`
  const source = opts.regex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(source, flags), replace)
}
