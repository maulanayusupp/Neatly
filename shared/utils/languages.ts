import type { LanguageId } from '../types'

/** Static metadata describing a supported language. */
export interface LanguageMeta {
  id: LanguageId
  label: string
  /** Short tab label. */
  short: string
  /** File extensions that map to this language (without the dot). */
  extensions: string[]
  /** Placeholder / example snippet shown in the editor. */
  hint: string
}

/** The single source of truth for supported languages. */
export const LANGUAGES: readonly LanguageMeta[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    short: 'JS',
    extensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx'],
    hint: 'JavaScript / TypeScript',
  },
  {
    id: 'css',
    label: 'CSS',
    short: 'CSS',
    extensions: ['css', 'scss', 'sass', 'less'],
    hint: 'CSS stylesheet',
  },
  {
    id: 'html',
    label: 'HTML',
    short: 'HTML',
    extensions: ['html', 'htm', 'xhtml', 'vue', 'svelte'],
    hint: 'HTML markup',
  },
  {
    id: 'json',
    label: 'JSON',
    short: 'JSON',
    extensions: ['json', 'jsonc', 'json5', 'webmanifest'],
    hint: 'JSON data',
  },
  {
    id: 'xml',
    label: 'XML',
    short: 'XML',
    extensions: ['xml', 'svg', 'rss', 'atom', 'xsl', 'xsd', 'plist'],
    hint: 'XML document',
  },
] as const

export const DEFAULT_LANGUAGE: LanguageId = 'javascript'

const LANGUAGE_MAP: Record<LanguageId, LanguageMeta> = Object.fromEntries(
  LANGUAGES.map(lang => [lang.id, lang]),
) as Record<LanguageId, LanguageMeta>

/** Narrowing type guard for arbitrary strings. */
export function isLanguageId(value: string): value is LanguageId {
  return value in LANGUAGE_MAP
}

/** Look up language metadata by id. */
export function getLanguage(id: LanguageId): LanguageMeta {
  return LANGUAGE_MAP[id]
}

/** Resolve a language from a filename via its extension. */
export function detectLanguageByFilename(filename: string): LanguageId | null {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (!ext) return null
  const match = LANGUAGES.find(lang => lang.extensions.includes(ext))
  return match?.id ?? null
}
