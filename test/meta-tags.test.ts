import { describe, expect, it } from 'vitest'
import { DEFAULT_META, escapeAttr, generateMetaTags, hostFromUrl } from '../app/utils/meta-tags'

describe('meta-tags', () => {
  it('escapes attribute values', () => {
    expect(escapeAttr('a "quote" <b> & c')).toBe('a &quot;quote&quot; &lt;b&gt; &amp; c')
  })

  it('extracts hostname without www', () => {
    expect(hostFromUrl('https://www.example.com/path?x=1')).toBe('example.com')
    expect(hostFromUrl('not a url')).toBe('')
  })

  it('generates title, OG and Twitter tags', () => {
    const out = generateMetaTags({
      ...DEFAULT_META,
      title: 'My Page',
      description: 'A great page',
      url: 'https://example.com',
      image: 'https://example.com/og.png',
      siteName: 'Example',
    })
    expect(out).toContain('<title>My Page</title>')
    expect(out).toContain('<meta name="description" content="A great page">')
    expect(out).toContain('<meta property="og:title" content="My Page">')
    expect(out).toContain('<meta property="og:image" content="https://example.com/og.png">')
    expect(out).toContain('<meta name="twitter:card" content="summary_large_image">')
    expect(out).toContain('<link rel="canonical" href="https://example.com">')
  })

  it('omits empty optional fields but always emits og:type + twitter:card', () => {
    const out = generateMetaTags({ ...DEFAULT_META, title: 'X' })
    expect(out).not.toContain('og:image')
    expect(out).not.toContain('keywords')
    expect(out).toContain('<meta property="og:type" content="website">')
    expect(out).toContain('<meta name="twitter:card"')
  })

  it('escapes injected quotes in output', () => {
    const out = generateMetaTags({ ...DEFAULT_META, title: 'Say "hi"' })
    expect(out).toContain('<title>Say &quot;hi&quot;</title>')
  })
})
