import { describe, expect, it } from 'vitest'
import { formatDataUri } from '../app/utils/image-base64'

const uri = 'data:image/png;base64,AAAA'

describe('image-base64', () => {
  it('returns the raw data URI', () => {
    expect(formatDataUri(uri, 'datauri')).toBe(uri)
  })
  it('wraps as CSS, HTML and Markdown', () => {
    expect(formatDataUri(uri, 'css')).toBe(`background-image: url("${uri}");`)
    expect(formatDataUri(uri, 'html')).toBe(`<img src="${uri}" alt="" />`)
    expect(formatDataUri(uri, 'markdown')).toBe(`![](${uri})`)
  })
  it('returns empty for empty input', () => {
    expect(formatDataUri('', 'css')).toBe('')
  })
})
