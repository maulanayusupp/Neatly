<script setup lang="ts">
import type { IconName } from '~/utils/icons'

withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: IconName
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}>(), {
  variant: 'secondary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
})
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block, 'btn--loading': loading }]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <BaseIcon v-else-if="icon" :name="icon" :size="size === 'sm' ? 16 : 18" />
    <span v-if="$slots.default" class="btn__label"><slot /></span>
  </button>
</template>

<style scoped lang="scss">
.btn {
  @include button-reset;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: spacing(2);
  border-radius: $radius-md;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid transparent;
  transition: background-color $transition-fast, border-color $transition-fast,
    color $transition-fast, transform $transition-fast, box-shadow $transition-fast;

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.btn--sm {
  padding: spacing(1.5) spacing(3);
  font-size: $text-sm;
}
.btn--md {
  padding: spacing(2.5) spacing(4);
  font-size: $text-sm;
}
.btn--lg {
  padding: spacing(3) spacing(6);
  font-size: $text-base;
}

.btn--primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
  box-shadow: var(--shadow-sm);

  &:hover:not(:disabled) {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-md);
  }
}

.btn--secondary {
  background: var(--color-surface);
  border-color: var(--color-border);
  color: var(--color-text);

  &:hover:not(:disabled) {
    border-color: var(--color-border-strong);
    background: var(--color-surface-2);
  }
}

.btn--ghost {
  background: transparent;
  color: var(--color-text-muted);

  &:hover:not(:disabled) {
    background: var(--color-surface-2);
    color: var(--color-text);
  }
}

.btn--block {
  width: 100%;
}

.btn__spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: btn-spin 0.6s linear infinite;
}

@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
