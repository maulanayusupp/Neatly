<script setup lang="ts">
withDefaults(defineProps<{
  /** Chip labels, in order. The parent maps the emitted index to a value. */
  items: string[]
  label?: string
}>(), {
  label: '',
})

const emit = defineEmits<{ select: [index: number] }>()
</script>

<template>
  <div class="presets">
    <span class="presets__label">{{ label || $t('common.examples') }}</span>
    <button
      v-for="(item, i) in items"
      :key="i"
      type="button"
      class="presets__chip"
      @click="emit('select', i)"
    >{{ item }}</button>
  </div>
</template>

<style scoped lang="scss">
.presets {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: spacing(2);
}

.presets__label {
  margin-right: spacing(1);
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text-subtle);
}

.presets__chip {
  @include button-reset;
  padding: spacing(1.5) spacing(3);
  border-radius: $radius-pill;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  font-size: $text-sm;
  color: var(--color-text-muted);
  transition: color $transition-fast, border-color $transition-fast, background $transition-fast;

  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
    background: var(--color-brand-soft);
  }
}
</style>
