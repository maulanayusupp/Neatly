import { LANDING_PAGES } from '#shared/utils/landing'

/** Dynamically generated sitemap covering static and landing pages. */
export default defineEventHandler((event) => {
  const { public: { siteUrl } } = useRuntimeConfig(event)

  const paths = [
    '',
    'tools',
    'convert',
    'sql',
    'compare',
    'json-viewer',
    'json-to-typescript',
    'diff',
    'color',
    'regex',
    'case',
    'scan',
    'qr-generator',
    'base64',
    'url-encode',
    'jwt-decoder',
    'hash',
    'uuid',
    'timestamp',
    'password',
    'number-base',
    'image-to-base64',
    'lorem',
    'markdown',
    'cron',
    'about',
    'contact',
    'terms',
    'privacy',
    'disclaimer',
    ...LANDING_PAGES.map(page => page.slug),
  ]

  const urls = paths
    .map(path => `  <url><loc>${siteUrl}/${path}</loc></url>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
})
