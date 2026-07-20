<script setup lang="ts">
import { TOOL_GROUPS } from '~/utils/tools'

const { t } = useI18n()

useSeoMeta({
  title: () => t('toolsPage.metaTitle'),
  description: () => t('toolsPage.metaDesc'),
  ogTitle: () => t('toolsPage.metaTitle'),
  ogDescription: () => t('toolsPage.metaDesc'),
  twitterTitle: () => t('toolsPage.metaTitle'),
  twitterDescription: () => t('toolsPage.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/tools' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="grid"
      :badge="$t('toolsPage.badge')"
      :title="$t('toolsPage.titleA')"
      :gradient="$t('toolsPage.titleHl')"
      :lead="$t('toolsPage.lead')"
    />

    <section class="container tools-dir">
      <div v-for="group in TOOL_GROUPS" :key="group.key" class="tools-dir__group">
        <h2 class="tools-dir__group-title">{{ $t(`groups.${group.key}`) }}</h2>
        <ul class="tools-dir__grid" role="list">
          <li v-for="tool in group.tools" :key="tool.to">
            <NuxtLink :to="tool.to" class="tools-dir__card">
              <span class="tools-dir__icon"><BaseIcon :name="tool.icon" :size="20" /></span>
              <span class="tools-dir__text">
                <span class="tools-dir__label">{{ tool.label }}</span>
                <span class="tools-dir__desc">{{ tool.desc }}</span>
              </span>
              <BaseIcon name="arrowRight" :size="16" class="tools-dir__arrow" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.tools-dir {
  padding-bottom: spacing(16);
  display: flex;
  flex-direction: column;
  gap: spacing(10);
}

.tools-dir__group-title {
  font-size: $text-xl;
  margin-bottom: spacing(4);
}

.tools-dir__grid {
  padding: 0;
  list-style: none;
  display: grid;
  gap: spacing(3);
  grid-template-columns: 1fr;

  @include respond('sm') { grid-template-columns: 1fr 1fr; }
  @include respond('lg') { grid-template-columns: repeat(3, 1fr); }
}

.tools-dir__card {
  display: flex;
  align-items: center;
  gap: spacing(3);
  padding: spacing(4);
  @include card;
  transition: transform $transition-fast, box-shadow $transition-fast, border-color $transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-border-strong);

    .tools-dir__arrow { color: var(--color-primary); transform: translateX(2px); }
  }
}

.tools-dir__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: $radius-md;
  background: var(--color-brand-soft);
  color: var(--color-primary);
}

.tools-dir__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.tools-dir__label {
  font-size: $text-sm;
  font-weight: 700;
  color: var(--color-text);
}

.tools-dir__desc {
  font-size: $text-xs;
  color: var(--color-text-muted);
}

.tools-dir__arrow {
  color: var(--color-text-subtle);
  flex-shrink: 0;
  transition: color $transition-fast, transform $transition-fast;
}
</style>
