<script setup lang="ts">
import { contrastRating, contrastRatio, hexToRgb, rgbToHsl } from '~/utils/colors'

const toast = useToast()
const hex = ref('#6366f1')
const copied = ref('')

const rgb = computed(() => hexToRgb(hex.value))
const formats = computed(() => {
  const c = rgb.value
  if (!c) return null
  const hsl = rgbToHsl(c)
  return {
    hex: rgbToHex(c),
    rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  }
})

const contrast = computed(() => {
  const c = rgb.value
  if (!c) return null
  const white = contrastRatio(c, { r: 255, g: 255, b: 255 })
  const black = contrastRatio(c, { r: 0, g: 0, b: 0 })
  return {
    white: { ratio: white.toFixed(2), rating: contrastRating(white) },
    black: { ratio: black.toFixed(2), rating: contrastRating(black) },
  }
})

function rgbToHex(c: { r: number, g: number, b: number }) {
  const h = (n: number) => n.toString(16).padStart(2, '0')
  return `#${h(c.r)}${h(c.g)}${h(c.b)}`
}

function onPick(event: Event) {
  hex.value = (event.target as HTMLInputElement).value
}

async function copy(key: string, value: string) {
  if (await copyText(value)) {
    copied.value = key
    toast.success('Copied')
    setTimeout(() => (copied.value = ''), 1400)
  }
}

const pageTitle = 'Color Converter — HEX, RGB & HSL Online + Contrast Checker · Neatly'
const pageDescription
  = 'Free online color converter. Convert between HEX, RGB and HSL, pick a color, preview it, and check WCAG contrast against black and white. Private, instant, no sign-up.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/color' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="droplet"
      badge="HEX · RGB · HSL · contrast"
      title="Color"
      gradient="converter"
      lead="Convert colors between HEX, RGB and HSL, preview them, and check WCAG contrast — all in your browser."
    />

    <section class="container tool-outlet color" :style="{ '--swatch': formats?.hex || 'transparent' }">
      <div class="tool-panel color__picker">
        <div class="color__preview" />
        <div class="color__inputs">
          <label class="color__native">
            <input type="color" :value="formats?.hex || '#000000'" aria-label="Pick a color" @input="onPick">
          </label>
          <input v-model="hex" class="color__hex" spellcheck="false" placeholder="#6366f1">
        </div>
      </div>

      <div v-if="formats" class="color__grid">
        <div class="tool-panel color__card">
          <h2 class="color__card-title">Formats</h2>
          <ul class="color__values" role="list">
            <li><span>HEX</span><code @click="copy('hex', formats.hex)">{{ formats.hex }}</code></li>
            <li><span>RGB</span><code @click="copy('rgb', formats.rgb)">{{ formats.rgb }}</code></li>
            <li><span>HSL</span><code @click="copy('hsl', formats.hsl)">{{ formats.hsl }}</code></li>
          </ul>
        </div>

        <div v-if="contrast" class="tool-panel color__card">
          <h2 class="color__card-title">Contrast (WCAG)</h2>
          <ul class="color__contrast" role="list">
            <li>
              <span class="color__swatch color__swatch--white">Aa</span>
              <span>on white</span>
              <strong>{{ contrast.white.ratio }}</strong>
              <em :class="`is-${contrast.white.rating.startsWith('AA') ? 'pass' : 'fail'}`">{{ contrast.white.rating }}</em>
            </li>
            <li>
              <span class="color__swatch color__swatch--black">Aa</span>
              <span>on black</span>
              <strong>{{ contrast.black.ratio }}</strong>
              <em :class="`is-${contrast.black.rating.startsWith('AA') ? 'pass' : 'fail'}`">{{ contrast.black.rating }}</em>
            </li>
          </ul>
        </div>
      </div>
      <p v-else class="color__error"><BaseIcon name="alert" :size="16" /> Enter a valid hex color (e.g. #6366f1).</p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.color {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.color__picker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: spacing(5);
}

.color__preview {
  width: 120px;
  height: 120px;
  border-radius: $radius-lg;
  background: var(--swatch);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

.color__inputs {
  display: flex;
  align-items: center;
  gap: spacing(3);
}

.color__native input[type='color'] {
  width: 48px;
  height: 48px;
  padding: 2px;
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  background: var(--color-surface-2);
  cursor: pointer;
}

.color__hex {
  width: 160px;
  padding: spacing(3) spacing(4);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-base;

  &:focus { outline: none; border-color: var(--color-primary); }
}

.color__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('md') { grid-template-columns: 1fr 1fr; }
}

.color__card-title {
  font-size: $text-base;
  margin-bottom: spacing(4);
}

.color__values {
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: spacing(2);

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: spacing(3);
    padding: spacing(2.5) spacing(3);
    border-radius: $radius-md;
    background: var(--color-surface-2);
  }
  span {
    font-size: $text-xs;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-subtle);
  }
  code {
    font-family: $font-mono;
    font-size: $text-sm;
    color: var(--color-text);
    cursor: pointer;
    &:hover { color: var(--color-primary); }
  }
}

.color__contrast {
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: spacing(2);

  li {
    display: flex;
    align-items: center;
    gap: spacing(3);
    padding: spacing(2) spacing(3);
    border-radius: $radius-md;
    background: var(--color-surface-2);
    font-size: $text-sm;
    color: var(--color-text-muted);
  }
  strong { margin-left: auto; font-family: $font-mono; color: var(--color-text); }
  em {
    font-style: normal;
    font-weight: 700;
    font-size: $text-xs;
    padding: spacing(0.5) spacing(2);
    border-radius: $radius-pill;
    &.is-pass { color: var(--color-success); background: var(--color-success-soft); }
    &.is-fail { color: var(--color-danger); background: var(--color-danger-soft); }
  }
}

.color__swatch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: $radius-sm;
  font-weight: 700;
  font-size: $text-xs;
  color: var(--swatch, #6366f1);
}
.color__swatch--white { background: #fff; }
.color__swatch--black { background: #000; }

.color__error {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(3) spacing(4);
  border-radius: $radius-md;
  background: var(--color-danger-soft);
  color: var(--color-danger);
  font-size: $text-sm;
  font-weight: 600;
}
</style>
