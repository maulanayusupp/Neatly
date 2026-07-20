import type { LanguageId } from '../types'
import { DEFAULT_LANGUAGE } from './languages'

/**
 * Best-effort language detection from a code snippet.
 *
 * This is a heuristic used purely for UX (auto-selecting a tab). The server
 * still transforms using whatever language the client ultimately sends.
 */
export function detectLanguage(code: string): LanguageId {
  const sample = code.trim()
  if (!sample) return DEFAULT_LANGUAGE

  const head = sample.slice(0, 2000)

  // JSON: starts like an object/array and parses cleanly.
  if (/^[{[]/.test(sample) && isProbablyJson(sample)) {
    return 'json'
  }

  // Markup: starts with a tag or a declaration.
  if (head.startsWith('<')) {
    if (/^<\?xml/i.test(head) || /xmlns[:=]/i.test(head)) return 'xml'
    if (/<!doctype html|<html[\s>]|<head[\s>]|<body[\s>]|<div[\s>]|<section[\s>]|<span[\s>]/i.test(head)) {
      return 'html'
    }
    if (/^<(svg|rss|feed|urlset|plist|\?xml)/i.test(head)) return 'xml'
    // A generic single-rooted tag document leans XML; otherwise HTML.
    return /<\/[a-z]+>/i.test(head) ? 'xml' : 'html'
  }

  // CSS: selector/at-rule followed by a declaration block, no JS keywords.
  if (looksLikeCss(head)) return 'css'

  return DEFAULT_LANGUAGE
}

function isProbablyJson(code: string): boolean {
  try {
    JSON.parse(code)
    return true
  }
  catch {
    // A truncated but clearly JSON-shaped payload should still count.
    return /^[{[][\s\S]*["}\]]\s*$/.test(code) && /"[^"]*"\s*:/.test(code)
  }
}

function looksLikeCss(code: string): boolean {
  if (/\b(function|const|let|var|=>|import\s|export\s|console\.)/.test(code)) {
    return false
  }
  return /@(media|import|charset|font-face|keyframes|supports)\b/.test(code)
    || /[.#]?[\w-]+\s*\{[^}]*[\w-]+\s*:[^;}]+[;}]/.test(code)
}
