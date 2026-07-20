<script setup lang="ts">
import type { IconName } from '~/utils/icons'

const props = withDefaults(defineProps<{
  title: string
  icon: IconName
  modelValue: string
  language?: string
  readonly?: boolean
  placeholder?: string
  errorLine?: number
  emptyText?: string
}>(), {
  language: undefined,
  readonly: false,
  placeholder: '',
  errorLine: undefined,
  emptyText: 'Your result will appear here.',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'file': [file: File]
}>()

const model = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const lineCount = computed(() => (props.modelValue ? props.modelValue.split('\n').length : 0))
const byteCount = computed(() => new TextEncoder().encode(props.modelValue).length)
</script>

<template>
  <section class="pane">
    <header class="pane__header">
      <h2 class="pane__title">
        <BaseIcon :name="icon" :size="16" />
        {{ title }}
      </h2>
      <p v-if="modelValue" class="pane__meta">
        <span>{{ formatNumber(lineCount) }} lines</span>
        <span aria-hidden="true">·</span>
        <span>{{ formatBytes(byteCount) }}</span>
      </p>
    </header>

    <div class="pane__body">
      <CodeEditor
        v-if="!readonly || modelValue"
        v-model="model"
        :language="language"
        :readonly="readonly"
        :placeholder="placeholder"
        :error-line="errorLine"
        :aria-label="title"
        @file="file => emit('file', file)"
      />
      <div v-else class="pane__empty">
        <BaseIcon name="layers" :size="28" />
        <p>{{ emptyText }}</p>
      </div>
    </div>

    <footer v-if="$slots.actions" class="pane__footer">
      <slot name="actions" />
    </footer>
  </section>
</template>

<style scoped lang="scss">
.pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
  @include card;
  overflow: hidden;
}

.pane__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: spacing(3);
  padding: spacing(3) spacing(4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.pane__title {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  font-size: $text-sm;
  font-weight: 700;
  color: var(--color-text);
}

.pane__meta {
  display: inline-flex;
  align-items: center;
  gap: spacing(1.5);
  font-size: $text-xs;
  color: var(--color-text-subtle);
  font-variant-numeric: tabular-nums;
}

.pane__body {
  flex: 1;
  min-height: 0;
  display: flex;
}

.pane__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: spacing(2);
  padding: spacing(6);
  text-align: center;
  color: var(--color-text-subtle);
  font-size: $text-sm;
}

.pane__footer {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(1);
  padding: spacing(2);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-2);
}
</style>
