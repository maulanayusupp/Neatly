import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import type { LanguageId } from '#shared/types'

let registered = false
function ensureRegistered() {
  if (registered) return
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('css', css)
  hljs.registerLanguage('xml', xml)
  hljs.registerLanguage('json', json)
  registered = true
}

// Neatly language ids -> highlight.js grammar names.
const GRAMMAR: Record<LanguageId, string> = {
  javascript: 'javascript',
  css: 'css',
  html: 'xml',
  json: 'json',
  xml: 'xml',
}

/** Escape raw text for safe injection when highlighting is unavailable. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Return syntax-highlighted HTML (highlight.js token markup) for a snippet.
 * Deterministic, so it produces identical output on the server and client and
 * causes no hydration mismatch. Falls back to escaped text on any error.
 */
export function highlightCode(code: string, language: LanguageId): string {
  ensureRegistered()
  try {
    return hljs.highlight(code, { language: GRAMMAR[language], ignoreIllegal: true }).value
  }
  catch {
    return escapeHtml(code)
  }
}
