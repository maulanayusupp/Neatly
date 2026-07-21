export interface MetaConfig {
  title: string
  description: string
  url: string
  image: string
  siteName: string
  type: string
  twitterCard: string
  twitterSite: string
  themeColor: string
  author: string
  keywords: string
  robots: string
  locale: string
}

export const DEFAULT_META: MetaConfig = {
  title: '',
  description: '',
  url: '',
  image: '',
  siteName: '',
  type: 'website',
  twitterCard: 'summary_large_image',
  twitterSite: '',
  themeColor: '',
  author: '',
  keywords: '',
  robots: 'index, follow',
  locale: '',
}

/** Escape a string for safe use inside an HTML attribute value. */
export function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** The hostname of a URL, or '' when it can't be parsed. */
export function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  }
  catch {
    return ''
  }
}

/** Build the standard, Open Graph and Twitter meta tags for a config. */
export function generateMetaTags(c: MetaConfig): string {
  const groups: string[][] = []

  const primary: string[] = []
  if (c.title) primary.push(`<title>${escapeAttr(c.title)}</title>`)
  if (c.description) primary.push(`<meta name="description" content="${escapeAttr(c.description)}">`)
  if (c.keywords) primary.push(`<meta name="keywords" content="${escapeAttr(c.keywords)}">`)
  if (c.author) primary.push(`<meta name="author" content="${escapeAttr(c.author)}">`)
  if (c.robots) primary.push(`<meta name="robots" content="${escapeAttr(c.robots)}">`)
  if (c.themeColor) primary.push(`<meta name="theme-color" content="${escapeAttr(c.themeColor)}">`)
  if (c.url) primary.push(`<link rel="canonical" href="${escapeAttr(c.url)}">`)
  if (primary.length) groups.push(primary)

  const og: string[] = ['<!-- Open Graph / Facebook -->']
  og.push(`<meta property="og:type" content="${escapeAttr(c.type || 'website')}">`)
  if (c.title) og.push(`<meta property="og:title" content="${escapeAttr(c.title)}">`)
  if (c.description) og.push(`<meta property="og:description" content="${escapeAttr(c.description)}">`)
  if (c.url) og.push(`<meta property="og:url" content="${escapeAttr(c.url)}">`)
  if (c.image) og.push(`<meta property="og:image" content="${escapeAttr(c.image)}">`)
  if (c.siteName) og.push(`<meta property="og:site_name" content="${escapeAttr(c.siteName)}">`)
  if (c.locale) og.push(`<meta property="og:locale" content="${escapeAttr(c.locale)}">`)
  groups.push(og)

  const tw: string[] = ['<!-- Twitter -->']
  tw.push(`<meta name="twitter:card" content="${escapeAttr(c.twitterCard || 'summary_large_image')}">`)
  if (c.title) tw.push(`<meta name="twitter:title" content="${escapeAttr(c.title)}">`)
  if (c.description) tw.push(`<meta name="twitter:description" content="${escapeAttr(c.description)}">`)
  if (c.image) tw.push(`<meta name="twitter:image" content="${escapeAttr(c.image)}">`)
  if (c.twitterSite) tw.push(`<meta name="twitter:site" content="${escapeAttr(c.twitterSite)}">`)
  groups.push(tw)

  return groups.map(g => g.join('\n')).join('\n\n')
}
