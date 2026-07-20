<script setup lang="ts">
const { stats, mode } = useTransform()

const reduced = computed(() => (stats.value?.savedBytes ?? 0) >= 0)

const ratio = computed(() => {
  if (!stats.value || stats.value.inputBytes === 0) return 0
  const r = stats.value.outputBytes / stats.value.inputBytes
  return Math.min(Math.max(r, 0), 1.5)
})

const deltaLabel = computed(() => {
  if (!stats.value) return ''
  const pct = formatPercent(Math.abs(stats.value.savedPercent))
  if (mode.value === 'minify') return `${pct} smaller`
  return reduced.value ? `${pct} smaller` : `${pct} larger`
})
</script>

<template>
  <div v-if="stats" class="stats" role="status">
    <div class="stats__item">
      <span class="stats__label">Before</span>
      <span class="stats__value">{{ formatBytes(stats.inputBytes) }}</span>
    </div>

    <BaseIcon name="beautify" :size="16" class="stats__arrow" />

    <div class="stats__item">
      <span class="stats__label">After</span>
      <span class="stats__value">{{ formatBytes(stats.outputBytes) }}</span>
    </div>

    <div class="stats__bar" aria-hidden="true">
      <span class="stats__bar-fill" :style="{ inlineSize: `${Math.min(ratio, 1) * 100}%` }" />
    </div>

    <span class="stats__delta" :class="reduced ? 'is-good' : 'is-neutral'">
      <BaseIcon :name="reduced ? 'minify' : 'beautify'" :size="14" />
      {{ deltaLabel }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.stats {
  display: flex;
  align-items: center;
  gap: spacing(4);
  flex-wrap: wrap;
  padding: spacing(3) spacing(5);
  @include card;
  font-variant-numeric: tabular-nums;
}

.stats__item {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.stats__label {
  font-size: $text-xs;
  color: var(--color-text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stats__value {
  font-size: $text-base;
  font-weight: 700;
  color: var(--color-text);
}

.stats__arrow {
  color: var(--color-text-subtle);
}

.stats__bar {
  flex: 1;
  min-width: 80px;
  height: 8px;
  border-radius: $radius-pill;
  background: var(--color-surface-3);
  overflow: hidden;
}

.stats__bar-fill {
  display: block;
  block-size: 100%;
  border-radius: $radius-pill;
  background: var(--gradient-brand);
  transition: inline-size $transition-slow;
}

.stats__delta {
  display: inline-flex;
  align-items: center;
  gap: spacing(1.5);
  padding: spacing(1.5) spacing(3);
  border-radius: $radius-pill;
  font-size: $text-sm;
  font-weight: 700;

  &.is-good {
    color: var(--color-success);
    background: var(--color-success-soft);
  }

  &.is-neutral {
    color: var(--color-primary);
    background: var(--color-brand-soft);
  }
}
</style>
