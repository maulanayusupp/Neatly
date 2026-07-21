<script setup lang="ts">
import type { IconName } from '~/utils/icons'
import { ALL_TOOLS } from '~/utils/tools'

const { t } = useI18n()

useSeoMeta({
  title: () => t('about.metaTitle'),
  description: () => t('about.metaDesc'),
  ogTitle: () => t('about.metaTitle'),
  ogDescription: () => t('about.metaDesc'),
  twitterTitle: () => t('about.metaTitle'),
  twitterDescription: () => t('about.metaDesc'),
})

const principles: { icon: IconName, key: string }[] = [
  { icon: 'gauge', key: 'fast' },
  { icon: 'shield', key: 'private' },
  { icon: 'sparkles', key: 'free' },
  { icon: 'layers', key: 'all' },
]
</script>

<template>
  <div class="about">
    <ToolHero
      icon="sparkles"
      :badge="$t('about.badge')"
      :title="$t('about.titleA')"
      :gradient="$t('about.titleHl')"
      :lead="$t('about.lead')"
    />

    <section class="container about__body">
      <ul class="about__principles" role="list">
        <li v-for="p in principles" :key="p.key" class="about__card">
          <span class="about__icon"><BaseIcon :name="p.icon" :size="20" /></span>
          <h2 class="about__card-title">{{ $t(`about.${p.key}T`) }}</h2>
          <p class="about__card-text">{{ $t(`about.${p.key}X`) }}</p>
        </li>
      </ul>

      <div class="about__maker">
        <div>
          <h2 class="about__maker-title">{{ $t('about.makerHeading') }}</h2>
          <p class="about__maker-text">{{ $t('about.makerText') }}</p>
        </div>
        <NuxtLink to="/contact" class="about__maker-cta">
          <BaseIcon name="send" :size="18" /> {{ $t('about.getInTouch') }}
        </NuxtLink>
      </div>

      <nav class="about__tools" aria-label="Tools">
        <h2 class="about__tools-title">{{ $t('about.exploreTools') }}</h2>
        <div class="about__tools-links">
          <NuxtLink v-for="tool in ALL_TOOLS" :key="tool.to" :to="tool.to">
            <BaseIcon :name="tool.icon" :size="15" /> {{ tool.label }}
          </NuxtLink>
        </div>
      </nav>
    </section>
  </div>
</template>

<style scoped lang="scss">
.about__body {
  padding-bottom: spacing(16);
  display: flex;
  flex-direction: column;
  gap: spacing(6);
}

.about__principles {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;
  padding: 0;
  list-style: none;

  @include respond('sm') { grid-template-columns: 1fr 1fr; }
  @include respond('lg') { grid-template-columns: repeat(4, 1fr); }
}

.about__card {
  padding: spacing(6);
  @include card;
}

.about__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: $radius-md;
  background: var(--color-brand-soft);
  color: var(--color-primary);
}

.about__card-title {
  margin-top: spacing(4);
  font-size: $text-lg;
}

.about__card-text {
  margin-top: spacing(2);
  color: var(--color-text-muted);
  font-size: $text-sm;
  line-height: 1.6;
}

.about__maker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: spacing(5);
  padding: spacing(7);
  @include card;
  background: linear-gradient(135deg, var(--color-brand-soft), transparent);

  strong { color: var(--color-text); }
}

.about__maker-title {
  font-size: $text-xl;
}

.about__maker-text {
  margin-top: spacing(3);
  max-width: 54ch;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.about__maker-cta {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(3) spacing(5);
  border-radius: $radius-md;
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-weight: 600;
  font-size: $text-sm;
  box-shadow: var(--shadow-md);
  white-space: nowrap;
  transition: background-color $transition-fast;

  &:hover { background: var(--color-primary-hover); }
}

.about__tools-title {
  font-size: $text-lg;
  text-align: center;
}

.about__tools-links {
  margin-top: spacing(4);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: spacing(2);

  a {
    display: inline-flex;
    align-items: center;
    gap: spacing(1.5);
    padding: spacing(2) spacing(3.5);
    border-radius: $radius-pill;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-muted);
    font-size: $text-sm;
    font-weight: 600;
    transition: color $transition-fast, border-color $transition-fast, background-color $transition-fast;

    &:hover {
      color: var(--color-primary);
      border-color: var(--color-primary);
      background: var(--color-brand-soft);
    }
  }
}
</style>
