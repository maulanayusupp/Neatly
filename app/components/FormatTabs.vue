<script setup lang="ts">
import type { ConvertFormat } from '#shared/types'
import { FORMATS } from '#shared/utils/formats'

defineProps<{
  modelValue: ConvertFormat
  label: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: ConvertFormat] }>()
</script>

<template>
  <div class="format-tabs">
    <span class="format-tabs__label">{{ label }}</span>
    <div class="format-tabs__group" role="group" :aria-label="label">
      <button
        v-for="format in FORMATS"
        :key="format.id"
        class="format-tabs__tab"
        type="button"
        :class="{ 'is-active': modelValue === format.id }"
        :aria-pressed="modelValue === format.id"
        @click="emit('update:modelValue', format.id)"
      >
        {{ format.label }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.format-tabs {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
}

.format-tabs__label {
  font-size: $text-xs;
  font-weight: 700;
  color: var(--color-text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.format-tabs__group {
  display: inline-flex;
  padding: spacing(1);
  gap: spacing(1);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
}

.format-tabs__tab {
  @include button-reset;

  padding: spacing(1.5) spacing(3);
  border-radius: $radius-sm;
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: color $transition-fast, background-color $transition-fast, box-shadow $transition-fast;

  &:hover {
    color: var(--color-text);
  }

  &.is-active {
    color: var(--color-text);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }
}
</style>
