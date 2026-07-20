<script setup lang="ts">
import type { IconName } from '~/utils/icons'

const features: { icon: IconName, key: string }[] = [
  { icon: 'beautify', key: 'beautify' },
  { icon: 'minify', key: 'minify' },
  { icon: 'layers', key: 'languages' },
  { icon: 'gauge', key: 'instant' },
  { icon: 'shield', key: 'private' },
  { icon: 'zap', key: 'friction' },
]
</script>

<template>
  <section class="features" aria-label="Features">
    <div class="container">
      <h2 class="features__heading">{{ $t('features.heading') }}</h2>
      <p class="features__sub">{{ $t('features.sub') }}</p>

      <ul class="features__grid" role="list">
        <li v-for="feature in features" :key="feature.key" class="feature-card">
          <span class="feature-card__icon">
            <BaseIcon :name="feature.icon" :size="20" />
          </span>
          <h3 class="feature-card__title">{{ $t(`features.${feature.key}.title`) }}</h3>
          <p class="feature-card__text">{{ $t(`features.${feature.key}.text`) }}</p>
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
