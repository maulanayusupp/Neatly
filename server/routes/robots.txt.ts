/** Site robots.txt — allow everything and point crawlers at the sitemap. */
export default defineEventHandler((event) => {
  const { public: { siteUrl } } = useRuntimeConfig(event)

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
})
