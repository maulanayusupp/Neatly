import type { LanguageId, TransformMode } from '../types'
import { LANGUAGES } from './languages'

export interface LandingFaq {
  q: string
  a: string
}

export interface LandingPage {
  slug: string
  mode: TransformMode
  language: LanguageId
  label: string
  title: string
  h1: string
  description: string
  intro: string
  faqs: LandingFaq[]
}

// Short, language-specific notes about the engine / behaviour.
const ENGINE_NOTE: Record<LanguageId, { minify: string, beautify: string }> = {
  javascript: {
    minify: 'It uses Terser to safely rename variables and strip whitespace, comments and dead code.',
    beautify: 'It re-indents and spaces your code with js-beautify so packed or one-line scripts become readable again.',
  },
  css: {
    minify: 'It uses clean-css to remove whitespace, comments and redundant rules while keeping your styles identical.',
    beautify: 'It expands rules onto their own lines with consistent indentation so stylesheets are easy to scan.',
  },
  html: {
    minify: 'It collapses whitespace, drops comments and minifies inline CSS/JS with html-minifier-terser.',
    beautify: 'It indents nested elements cleanly so cramped or minified markup becomes readable.',
  },
  json: {
    minify: 'It parses and re-serialises your JSON without any spacing, producing the smallest valid document.',
    beautify: 'It pretty-prints JSON with your chosen indentation and validates it along the way.',
  },
  xml: {
    minify: 'It removes insignificant whitespace and comments while preserving the document structure.',
    beautify: 'It indents elements and attributes so dense XML documents are easy to read.',
  },
}

function buildPage(mode: TransformMode, language: LanguageId, label: string): LandingPage {
  const note = ENGINE_NOTE[language][mode]
  if (mode === 'minify') {
    return {
      slug: `minify-${language}`,
      mode,
      language,
      label,
      title: `Minify ${label} Online — Free ${label} Minifier · Neatly`,
      h1: `Minify ${label}`,
      description: `Free online ${label} minifier. Paste your ${label} and instantly compress it — strip whitespace and comments to ship smaller files. No sign-up, runs privately.`,
      intro: `Paste your ${label} below and hit Minify to compress it in one click. ${note} See exactly how many bytes (and gzipped bytes) you save.`,
      faqs: [
        {
          q: `Is the ${label} minifier free?`,
          a: `Yes. Neatly's ${label} minifier is completely free, needs no sign-up, and has no usage limits.`,
        },
        {
          q: `Is my ${label} kept private?`,
          a: `Your ${label} is processed on the fly and never stored or shared — nothing is saved on our servers.`,
        },
        {
          q: `Will minifying change how my ${label} works?`,
          a: `No. Minification only removes what a machine ignores; the meaning and structure of your ${label} stay exactly the same.`,
        },
      ],
    }
  }
  return {
    slug: `beautify-${language}`,
    mode,
    language,
    label,
    title: `${label} Beautifier — Format & Unminify ${label} Online · Neatly`,
    h1: `Beautify ${label}`,
    description: `Free online ${label} beautifier and unminifier. Paste minified ${label} to format it into clean, readable, properly indented code. No sign-up, runs privately.`,
    intro: `Paste minified or messy ${label} below and hit Beautify to format it. ${note} Choose your indentation and copy or download the result.`,
    faqs: [
      {
        q: `Is the ${label} beautifier free?`,
        a: `Yes. Neatly's ${label} beautifier is completely free, needs no sign-up, and has no usage limits.`,
      },
      {
        q: `Can Neatly unminify ${label}?`,
        a: `Yes. Neatly re-indents and reformats minified ${label} into readable code${language === 'javascript' ? ', though original variable names cannot be recovered once they were shortened' : ''}.`,
      },
      {
        q: `Is my ${label} kept private?`,
        a: `Your ${label} is processed on the fly and never stored or shared — nothing is saved on our servers.`,
      },
    ],
  }
}

/** All generated landing pages (2 modes × 5 languages). */
export const LANDING_PAGES: readonly LandingPage[] = LANGUAGES.flatMap(lang => [
  buildPage('minify', lang.id, lang.label),
  buildPage('beautify', lang.id, lang.label),
])

const LANDING_MAP = new Map(LANDING_PAGES.map(page => [page.slug, page]))

export function getLandingPage(slug: string): LandingPage | undefined {
  return LANDING_MAP.get(slug)
}
