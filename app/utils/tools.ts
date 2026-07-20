import type { IconName } from '~/utils/icons'

export interface ToolLink {
  to: string
  label: string
  desc: string
  icon: IconName
}

export interface ToolGroup {
  name: string
  tools: ToolLink[]
}

/**
 * Single source of truth for the tools navigation (header dropdown + footer).
 * Add a tool's entry here when its page ships so links never 404.
 */
export const TOOL_GROUPS: ToolGroup[] = [
  {
    name: 'Format',
    tools: [
      { to: '/', label: 'Beautify & Minify', desc: 'Format or compress code', icon: 'code' },
      { to: '/convert', label: 'Convert', desc: 'JSON · YAML · CSV · XML', icon: 'beautify' },
    ],
  },
  {
    name: 'JSON',
    tools: [
      { to: '/json-viewer', label: 'JSON Viewer', desc: 'Validate & explore JSON', icon: 'tree' },
      { to: '/compare', label: 'JSON Compare', desc: 'Diff 2–4 JSON files', icon: 'layers' },
    ],
  },
  {
    name: 'QR & codes',
    tools: [
      { to: '/scan', label: 'QR Scanner', desc: 'Read QR & barcodes', icon: 'qr' },
      { to: '/qr-generator', label: 'QR Generator', desc: 'Create QR & barcodes', icon: 'grid' },
    ],
  },
  {
    name: 'Encode & data',
    tools: [
      { to: '/base64', label: 'Base64', desc: 'Encode / decode', icon: 'code' },
      { to: '/url-encode', label: 'URL Encode', desc: 'Percent-encode text', icon: 'link' },
      { to: '/jwt-decoder', label: 'JWT Decoder', desc: 'Decode JSON Web Tokens', icon: 'key' },
      { to: '/hash', label: 'Hash', desc: 'SHA-1 / 256 / 384 / 512', icon: 'hash' },
      { to: '/uuid', label: 'UUID', desc: 'Generate v4 UUIDs', icon: 'fingerprint' },
      { to: '/timestamp', label: 'Timestamp', desc: 'Epoch ↔ date', icon: 'clock' },
    ],
  },
]

export const ALL_TOOLS: ToolLink[] = TOOL_GROUPS.flatMap(group => group.tools)
