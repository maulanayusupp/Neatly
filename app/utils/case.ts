function cap(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/** Split text into lowercase word tokens (handles camelCase, spaces, symbols). */
export function tokens(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(w => w.toLowerCase())
}

function sentenceCase(input: string): string {
  return input.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase())
}

export interface CaseConverter {
  key: string
  fn: (input: string) => string
}

/** All case transforms shown by the tool (labels are universal dev terms). */
export const CASE_CONVERTERS: CaseConverter[] = [
  { key: 'UPPERCASE', fn: s => s.toUpperCase() },
  { key: 'lowercase', fn: s => s.toLowerCase() },
  { key: 'Title Case', fn: s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) },
  { key: 'Sentence case', fn: sentenceCase },
  { key: 'camelCase', fn: s => tokens(s).map((w, i) => (i ? cap(w) : w)).join('') },
  { key: 'PascalCase', fn: s => tokens(s).map(cap).join('') },
  { key: 'snake_case', fn: s => tokens(s).join('_') },
  { key: 'kebab-case', fn: s => tokens(s).join('-') },
  { key: 'CONSTANT_CASE', fn: s => tokens(s).join('_').toUpperCase() },
  { key: 'slug', fn: s => tokens(s).join('-') },
]
