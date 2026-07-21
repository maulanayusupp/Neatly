export interface RobotsGroup {
  userAgent: string
  disallow: string[]
  allow: string[]
  crawlDelay: string
}

export interface RobotsConfig {
  groups: RobotsGroup[]
  sitemaps: string[]
  host: string
}

/** Render a robots.txt file from a structured config. */
export function generateRobots(cfg: RobotsConfig): string {
  const blocks: string[] = []

  for (const g of cfg.groups) {
    const lines = [`User-agent: ${g.userAgent.trim() || '*'}`]
    const disallow = g.disallow.map(x => x.trim()).filter(Boolean)
    const allow = g.allow.map(x => x.trim()).filter(Boolean)

    // No rules means "allow everything" — expressed as an empty Disallow.
    if (!disallow.length && !allow.length)
      lines.push('Disallow:')
    for (const d of disallow)
      lines.push(`Disallow: ${d}`)
    for (const a of allow)
      lines.push(`Allow: ${a}`)
    if (g.crawlDelay.trim())
      lines.push(`Crawl-delay: ${g.crawlDelay.trim()}`)

    blocks.push(lines.join('\n'))
  }

  const trailer: string[] = []
  for (const s of cfg.sitemaps.map(x => x.trim()).filter(Boolean))
    trailer.push(`Sitemap: ${s}`)
  if (cfg.host.trim())
    trailer.push(`Host: ${cfg.host.trim()}`)

  const out = [blocks.join('\n\n'), trailer.join('\n')].filter(Boolean).join('\n\n')
  return `${out}\n`
}
