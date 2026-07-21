import { describe, expect, it } from 'vitest'
import { generateRobots } from '../app/utils/robots'

const group = (o: Partial<import('../app/utils/robots').RobotsGroup> = {}) => ({
  userAgent: '*',
  disallow: [],
  allow: [],
  crawlDelay: '',
  ...o,
})

describe('robots.txt generator', () => {
  it('allow-all yields an empty Disallow', () => {
    expect(generateRobots({ groups: [group()], sitemaps: [], host: '' }))
      .toBe('User-agent: *\nDisallow:\n')
  })

  it('block-all', () => {
    expect(generateRobots({ groups: [group({ disallow: ['/'] })], sitemaps: [], host: '' }))
      .toBe('User-agent: *\nDisallow: /\n')
  })

  it('disallow + allow + crawl-delay in order', () => {
    const out = generateRobots({ groups: [group({ disallow: ['/admin', '/private'], allow: ['/admin/public'], crawlDelay: '10' })], sitemaps: [], host: '' })
    expect(out).toBe('User-agent: *\nDisallow: /admin\nDisallow: /private\nAllow: /admin/public\nCrawl-delay: 10\n')
  })

  it('multiple groups + sitemap + host', () => {
    const out = generateRobots({
      groups: [group({ disallow: ['/'] }), group({ userAgent: 'Googlebot' })],
      sitemaps: ['https://example.com/sitemap.xml'],
      host: 'example.com',
    })
    expect(out).toBe(
      'User-agent: *\nDisallow: /\n\n'
      + 'User-agent: Googlebot\nDisallow:\n\n'
      + 'Sitemap: https://example.com/sitemap.xml\nHost: example.com\n',
    )
  })

  it('trims blank rule lines', () => {
    expect(generateRobots({ groups: [group({ disallow: ['/x', '  ', ''] })], sitemaps: ['  '], host: '' }))
      .toBe('User-agent: *\nDisallow: /x\n')
  })
})
