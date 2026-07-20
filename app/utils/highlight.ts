import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import sql from 'highlight.js/lib/languages/sql'

let registered = false
function ensureRegistered() {
  if (registered) return
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('typescript', typescript)
  hljs.registerLanguage('css', css)
  hljs.registerLanguage('xml', xml)
  hljs.registerLanguage('json', json)
  hljs.registerLanguage('yaml', yaml)
  hljs.registerLanguage('sql', sql)
  registered = true
}

// Editor language / format ids -> highlight.js grammar names.
// Anything not listed (e.g. csv) falls back to plain escaped text.
const GRAMMAR: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  css: 'css',
  html: 'xml',
  json: 'json',
  xml: 'xml',
  yaml: 'yaml',
  sql: 'sql',
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
export function highlightCode(code: string, language: string): string {
  const grammar = GRAMMAR[language]
  if (!grammar) return escapeHtml(code)
  ensureRegistered()
  try {
    return hljs.highlight(code, { language: grammar, ignoreIllegal: true }).value
  }
  catch {
    return escapeHtml(code)
  }
}
