export type DataUriFormat = 'datauri' | 'css' | 'html' | 'markdown'

export const DATA_URI_FORMATS: DataUriFormat[] = ['datauri', 'css', 'html', 'markdown']

/** Wrap a data: URI in the chosen output snippet. */
export function formatDataUri(dataUri: string, format: DataUriFormat): string {
  if (!dataUri) return ''
  switch (format) {
    case 'css':
      return `background-image: url("${dataUri}");`
    case 'html':
      return `<img src="${dataUri}" alt="" />`
    case 'markdown':
      return `![](${dataUri})`
    default:
      return dataUri
  }
}
