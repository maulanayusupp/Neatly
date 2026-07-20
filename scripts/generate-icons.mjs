// Regenerate raster icons from public/favicon.svg.
// Usage: node scripts/generate-icons.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { Resvg } from '@resvg/resvg-js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const svg = readFileSync(resolve(root, 'public/favicon.svg'))

function render(size) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } })
  return resvg.render().asPng()
}

const targets = [
  ['public/apple-touch-icon.png', 180],
  ['public/icon-192.png', 192],
  ['public/icon-512.png', 512],
  ['public/favicon-16.png', 16],
  ['public/favicon-32.png', 32],
  ['public/favicon-48.png', 48],
]

for (const [file, size] of targets) {
  writeFileSync(resolve(root, file), render(size))
  console.log(`✓ ${file} (${size}px)`)
}
