import type { ConvertFormat } from '../types'

export interface FormatMeta {
  id: ConvertFormat
  label: string
  /** highlight.js grammar name used for the editor (undefined = plain). */
  highlight?: string
  extension: string
  mime: string
}

/** Single source of truth for the converter's formats. */
export const FORMATS: readonly FormatMeta[] = [
  { id: 'json', label: 'JSON', highlight: 'json', extension: 'json', mime: 'application/json' },
  { id: 'yaml', label: 'YAML', highlight: 'yaml', extension: 'yaml', mime: 'text/yaml' },
  { id: 'csv', label: 'CSV', extension: 'csv', mime: 'text/csv' },
  { id: 'xml', label: 'XML', highlight: 'xml', extension: 'xml', mime: 'application/xml' },
] as const

const FORMAT_MAP = Object.fromEntries(
  FORMATS.map(format => [format.id, format]),
) as Record<ConvertFormat, FormatMeta>

export function isConvertFormat(value: string): value is ConvertFormat {
  return value in FORMAT_MAP
}

export function getFormat(id: ConvertFormat): FormatMeta {
  return FORMAT_MAP[id]
}
