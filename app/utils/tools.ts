import type { IconName } from '~/utils/icons'

export interface ToolLink {
  to: string
  label: string
  desc: string
  icon: IconName
}

export interface ToolGroup {
  /** i18n key under `groups.*` */
  key: string
  name: string
  tools: ToolLink[]
}

/**
 * Single source of truth for the tools navigation (header dropdown + footer).
 * Add a tool's entry here when its page ships so links never 404.
 */
export const TOOL_GROUPS: ToolGroup[] = [
  {
    key: 'format',
    name: 'Format',
    tools: [
      { to: '/', label: 'Beautify & Minify', desc: 'Format or compress code', icon: 'code' },
      { to: '/convert', label: 'Convert', desc: 'JSON · YAML · CSV · XML', icon: 'beautify' },
      { to: '/sql', label: 'SQL Formatter', desc: 'Beautify SQL queries', icon: 'code' },
      { to: '/yaml', label: 'YAML Validator', desc: 'Validate & format YAML', icon: 'check' },
    ],
  },
  {
    key: 'json',
    name: 'JSON',
    tools: [
      { to: '/json-viewer', label: 'JSON Viewer', desc: 'Validate & explore JSON', icon: 'tree' },
      { to: '/compare', label: 'JSON Compare', desc: 'Diff 2–4 JSON files', icon: 'layers' },
      { to: '/json-to-typescript', label: 'JSON → TypeScript', desc: 'Generate TS interfaces', icon: 'braces' },
    ],
  },
  {
    key: 'text',
    name: 'Text & web',
    tools: [
      { to: '/text-tools', label: 'Text Utilities', desc: 'Count, sort, dedupe, case, replace', icon: 'file' },
      { to: '/diff', label: 'Text Diff', desc: 'Compare two texts', icon: 'columns' },
      { to: '/color', label: 'Color Converter', desc: 'HEX · RGB · HSL', icon: 'droplet' },
      { to: '/regex', label: 'Regex Tester', desc: 'Test regular expressions', icon: 'regex' },
      { to: '/case', label: 'Case Converter', desc: 'camelCase, snake, kebab, slug', icon: 'code' },
      { to: '/lorem', label: 'Lorem Ipsum', desc: 'Placeholder text generator', icon: 'file' },
      { to: '/markdown', label: 'Markdown → HTML', desc: 'Preview & convert Markdown', icon: 'markdown' },
      { to: '/cron', label: 'Cron Explainer', desc: 'Explain cron expressions', icon: 'clock' },
      { to: '/meta-tags', label: 'Meta Tag Generator', desc: 'SEO, Open Graph & Twitter tags', icon: 'globe' },
      { to: '/url-parser', label: 'URL Parser', desc: 'Break down & edit URLs', icon: 'link' },
      { to: '/robots-txt', label: 'robots.txt Generator', desc: 'Build a robots.txt file', icon: 'shield' },
    ],
  },
  {
    key: 'qr',
    name: 'QR & codes',
    tools: [
      { to: '/scan', label: 'QR Scanner', desc: 'Read QR & barcodes', icon: 'qr' },
      { to: '/qr-generator', label: 'QR Generator', desc: 'Create QR & barcodes', icon: 'grid' },
    ],
  },
  {
    key: 'encode',
    name: 'Encode & data',
    tools: [
      { to: '/base64', label: 'Base64', desc: 'Encode / decode', icon: 'code' },
      { to: '/url-encode', label: 'URL Encode', desc: 'Percent-encode text', icon: 'link' },
      { to: '/jwt-decoder', label: 'JWT Decoder', desc: 'Decode JSON Web Tokens', icon: 'key' },
      { to: '/hash', label: 'Hash', desc: 'SHA-1 / 256 / 384 / 512', icon: 'hash' },
      { to: '/uuid', label: 'UUID', desc: 'Generate v4 UUIDs', icon: 'fingerprint' },
      { to: '/timestamp', label: 'Timestamp', desc: 'Epoch ↔ date', icon: 'clock' },
      { to: '/timezone', label: 'Timezone Converter', desc: 'Compare times across zones', icon: 'globe' },
      { to: '/password', label: 'Password', desc: 'Strong random passwords', icon: 'lock' },
      { to: '/number-base', label: 'Number Base', desc: 'Bin · Oct · Dec · Hex', icon: 'hash' },
      { to: '/image-to-base64', label: 'Image to Base64', desc: 'Image → data URI', icon: 'image' },
    ],
  },
]

export const ALL_TOOLS: ToolLink[] = TOOL_GROUPS.flatMap(group => group.tools)
