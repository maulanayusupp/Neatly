// Generate a unique 1200x630 social preview image per tool.
// Usage: node scripts/generate-og.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { Resvg } from '@resvg/resvg-js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/og')
mkdirSync(outDir, { recursive: true })

// Pull { to, label, desc } straight from the tools registry so this stays in
// sync as tools are added.
const toolsSrc = readFileSync(resolve(root, 'app/utils/tools.ts'), 'utf8')
const tools = [...toolsSrc.matchAll(/\{\s*to:\s*'([^']+)',\s*label:\s*'([^']*)',\s*desc:\s*'([^']*)'/g)]
  .map(m => ({ to: m[1], label: m[2], desc: m[3] }))
  .filter(t => t.to !== '/') // home keeps the default og-image.png

const siteHost = (process.env.NUXT_PUBLIC_SITE_URL || 'https://withneatly.com').replace(/^https?:\/\//, '').replace(/\/$/, '')
const escapeXml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// resvg's fallback fonts lack arrow glyphs — spell them out.
const clean = s => s.replace(/→/g, 'to').replace(/↔/g, 'and').trim()

function template(label, desc) {
  const title = escapeXml(clean(label))
  const sub = escapeXml(clean(desc))
  const fontSize = title.length > 17 ? 66 : 82
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0d16"/>
      <stop offset="1" stop-color="#171a2e"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#818cf8"/>
      <stop offset="0.55" stop-color="#a78bfa"/>
      <stop offset="1" stop-color="#e879f9"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="6" fill="url(#brand)"/>

  <g transform="translate(80,70)">
    <rect width="66" height="66" rx="18" fill="url(#brand)"/>
    <path fill="#0b0d16" d="M28 15l3.5 11.5L43 30l-11.5 3.5L28 45l-3.5-11.5L13 30l11.5-3.5z"/>
    <text x="84" y="44" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="700" fill="#e9ebf5" letter-spacing="-1">Neatly</text>
  </g>

  <text x="82" y="235" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#818cf8" letter-spacing="3">FREE · PRIVATE · NO SIGN-UP</text>

  <text x="80" y="345" font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="800" letter-spacing="-2"><tspan fill="url(#brand)">${title}</tspan></text>

  <text x="82" y="425" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="600" fill="#9aa2bd">${sub}</text>

  <g font-family="Helvetica, Arial, sans-serif" font-size="25" font-weight="700">
    <g transform="translate(80,500)">
      <rect width="240" height="54" rx="27" fill="#1d2130" stroke="#2a2f42"/>
      <text x="120" y="35" fill="#a5b4fc" text-anchor="middle">Runs in your browser</text>
    </g>
    <g transform="translate(336,500)">
      <rect width="150" height="54" rx="27" fill="#1d2130" stroke="#2a2f42"/>
      <text x="75" y="35" fill="#a5b4fc" text-anchor="middle">Free tool</text>
    </g>
  </g>

  <text x="80" y="600" font-family="Helvetica, Arial, sans-serif" font-size="25" font-weight="600" fill="#6f778f">${escapeXml(siteHost)}</text>
</svg>`
}

function render(svg) {
  return new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: { loadSystemFonts: true, defaultFontFamily: 'Helvetica' },
  }).render().asPng()
}

for (const t of tools) {
  const slug = t.to.replace(/^\//, '')
  writeFileSync(resolve(outDir, `${slug}.png`), render(template(t.label, t.desc)))
  console.log(`✓ public/og/${slug}.png — ${t.label}`)
}
console.log(`\nGenerated ${tools.length} OG images.`)
