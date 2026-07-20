<script setup lang="ts">
import type { IconName } from '~/utils/icons'

const features: { icon: IconName, title: string, text: string }[] = [
  {
    icon: 'beautify',
    title: 'Beautify & unminify',
    text: 'Turn minified, packed or obfuscated code back into clean, readable, properly indented source.',
  },
  {
    icon: 'minify',
    title: 'Minify & compress',
    text: 'Strip whitespace and comments to ship smaller JavaScript, CSS, HTML, JSON and XML.',
  },
  {
    icon: 'layers',
    title: 'Five languages',
    text: 'JavaScript & TypeScript, CSS, HTML, JSON and XML — auto-detected as you paste.',
  },
  {
    icon: 'gauge',
    title: 'Instant & accurate',
    text: 'Powered by battle-tested engines (Terser, clean-css, js-beautify) for reliable results.',
  },
  {
    icon: 'shield',
    title: 'Private by default',
    text: 'Your code is processed on the fly and never stored — nothing is saved or shared.',
  },
  {
    icon: 'zap',
    title: 'Zero friction',
    text: 'Paste, drop a file, or upload. Copy or download the result in a single click.',
  },
]
</script>

<template>
  <section class="features" aria-label="Features">
    <div class="container">
      <h2 class="features__heading">Everything you need to tidy up code</h2>
      <p class="features__sub">
        A fast, modern alternative for beautifying and minifying source files — no sign-up required.
      </p>

      <ul class="features__grid" role="list">
        <li v-for="feature in features" :key="feature.title" class="feature-card">
          <span class="feature-card__icon">
            <BaseIcon :name="feature.icon" :size="20" />
          </span>
          <h3 class="feature-card__title">{{ feature.title }}</h3>
          <p class="feature-card__text">{{ feature.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.features {
  padding-block: spacing(16) spacing(12);
}

.features__heading {
  font-size: $text-3xl;
  text-align: center;
}

.features__sub {
  margin: spacing(3) auto 0;
  max-width: 56ch;
  text-align: center;
  color: var(--color-text-muted);
}

.features__grid {
  margin-top: spacing(10);
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('sm') {
    grid-template-columns: repeat(2, 1fr);
  }
  @include respond('lg') {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  padding: spacing(6);
  @include card;
  transition: transform $transition-base, box-shadow $transition-base, border-color $transition-base;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-border-strong);
  }
}

.feature-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: $radius-md;
  background: var(--color-brand-soft);
  color: var(--color-primary);
}

.feature-card__title {
  margin-top: spacing(4);
  font-size: $text-lg;
}

.feature-card__text {
  margin-top: spacing(2);
  color: var(--color-text-muted);
  font-size: $text-sm;
  line-height: 1.6;
}
</style>
