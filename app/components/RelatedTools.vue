<script setup lang="ts">
import { ALL_TOOLS, TOOL_GROUPS } from '~/utils/tools'

const route = useRoute()

const group = computed(() => TOOL_GROUPS.find(g => g.tools.some(t => t.to === route.path)))

const related = computed(() => {
  // Only on real tool pages, and not the homepage (it has its own showcase).
  if (route.path === '/' || !group.value)
    return []
  const siblings = group.value.tools.filter(t => t.to !== route.path)
  const others = ALL_TOOLS.filter(t => t.to !== route.path && t.to !== '/' && !siblings.includes(t))
  return [...siblings, ...others].slice(0, 4)
})
</script>

<template>
  <section v-if="related.length" class="related container">
    <h2 class="related__title">{{ $t('common.relatedTools') }}</h2>
    <div class="related__grid">
      <NuxtLink v-for="t in related" :key="t.to" :to="t.to" class="related__card">
        <span class="related__icon"><BaseIcon :name="t.icon" :size="20" /></span>
        <span class="related__text">
          <span class="related__name">{{ t.label }}</span>
          <span class="related__desc">{{ t.desc }}</span>
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.related {
  padding-block: spacing(8) spacing(2);
}

.related__title {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
  margin-bottom: spacing(4);
}

.related__grid {
  display: grid;
  gap: spacing(3);
  grid-template-columns: 1fr;

  @include respond('sm') { grid-template-columns: 1fr 1fr; }
  @include respond('lg') { grid-template-columns: repeat(4, 1fr); }
}

.related__card {
  display: flex;
  align-items: flex-start;
  gap: spacing(3);
  padding: spacing(4);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  background: var(--color-surface);
  transition: border-color $transition-fast, transform $transition-fast, box-shadow $transition-fast;

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
}

.related__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: $radius-md;
  background: var(--color-brand-soft);
  color: var(--color-primary);
}

.related__text { display: flex; flex-direction: column; gap: spacing(1); min-width: 0; }

.related__name { font-weight: 600; font-size: $text-sm; color: var(--color-text); }

.related__desc { font-size: $text-xs; color: var(--color-text-muted); }
</style>
