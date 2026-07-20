<script setup lang="ts">
import type { TransformMode } from '#shared/types'

defineProps<{ modelValue: TransformMode }>()
const emit = defineEmits<{ 'update:modelValue': [value: TransformMode] }>()

const modes: { id: TransformMode, label: string, icon: 'beautify' | 'minify' }[] = [
  { id: 'beautify', label: 'Beautify', icon: 'beautify' },
  { id: 'minify', label: 'Minify', icon: 'minify' },
]
</script>

<template>
  <div class="mode-switch" role="tablist" aria-label="Transform mode">
    <button
      v-for="m in modes"
      :key="m.id"
      class="mode-switch__option"
      :class="{ 'is-active': modelValue === m.id }"
      role="tab"
      :aria-selected="modelValue === m.id"
      type="button"
      @click="emit('update:modelValue', m.id)"
    >
      <BaseIcon :name="m.icon" :size="17" />
      <span>{{ m.label }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.mode-switch {
  display: inline-flex;
  padding: spacing(1);
  gap: spacing(1);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
}

.mode-switch__option {
  @include button-reset;

  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(2) spacing(4);
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
