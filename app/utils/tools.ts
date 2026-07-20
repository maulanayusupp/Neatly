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
]

export const ALL_TOOLS: ToolLink[] = TOOL_GROUPS.flatMap(group => group.tools)
