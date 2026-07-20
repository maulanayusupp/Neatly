// Regenerate raster icons from public/favicon.svg.
// Usage: node scripts/generate-icons.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { Resvg } from '@resvg/resvg-js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const svg = readFileSync(resolve(root, 'public/favicon.svg'))

function render(source, size) {
  const resvg = new Resvg(source, {
    fitTo: { mode: 'width', value: size },
    font: { loadSystemFonts: true, defaultFontFamily: 'Helvetica' },
  })
  return resvg.render().asPng()
}

const targets = [
  ['public/apple-touch-icon.png', 180],
  ['public/icon-192.png', 192],
  ['public/icon-512.png', 512],
]

for (const [file, size] of targets) {
  writeFileSync(resolve(root, file), render(svg, size))
  console.log(`✓ ${file} (${size}px)`)
}

// favicon.ico is rebuilt manually (rarely) with ImageMagick, e.g.:
//   node -e "require('@resvg/resvg-js')" # (sizes rendered below to /tmp)
//   magick /tmp/f16.png /tmp/f32.png /tmp/f48.png public/favicon.ico

// Social preview image (WhatsApp/Twitter/OG need a raster, not SVG).
const ogSvg = readFileSync(resolve(root, 'public/og-image.svg'))
writeFileSync(resolve(root, 'public/og-image.png'), render(ogSvg, 1200))
console.log('✓ public/og-image.png (1200px)')
