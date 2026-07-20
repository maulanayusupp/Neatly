<script setup lang="ts">
import type { LanguageId } from '#shared/types'
import { escapeHtml, highlightCode } from '~/utils/highlight'

const props = withDefaults(defineProps<{
  modelValue: string
  readonly?: boolean
  placeholder?: string
  ariaLabel?: string
  language?: LanguageId
}>(), {
  readonly: false,
  placeholder: '',
  ariaLabel: 'Code editor',
  language: undefined,
})

const highlighted = computed(() =>
  props.language
    ? highlightCode(props.modelValue, props.language)
    : escapeHtml(props.modelValue),
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'file': [file: File]
}>()

const gutter = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const lineNumbers = computed(() => {
  const count = Math.max(1, props.modelValue.split('\n').length)
  return Array.from({ length: count }, (_, i) => i + 1)
})

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

function syncScroll(event: Event) {
  if (gutter.value) {
    gutter.value.scrollTop = (event.target as HTMLElement).scrollTop
  }
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) emit('file', file)
}

function onDragOver() {
  if (!props.readonly) isDragging.value = true
}
</script>

<template>
  <div
    class="code-editor"
    :class="{ 'code-editor--dragging': isDragging }"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
  >
    <div ref="gutter" class="code-editor__gutter" aria-hidden="true">
      <span v-for="n in lineNumbers" :key="n" class="code-editor__line-no">{{ n }}</span>
    </div>

    <textarea
      v-if="!readonly"
      class="code-editor__area"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      spellcheck="false"
      autocomplete="off"
      autocapitalize="off"
      autocorrect="off"
      wrap="off"
      @input="onInput"
      @scroll="syncScroll"
    />
    <pre
      v-else
      class="code-editor__area code-editor__area--readonly"
      :aria-label="ariaLabel"
      tabindex="0"
      @scroll="syncScroll"
    ><code class="hljs" v-html="highlighted" /></pre>

    <div v-if="isDragging" class="code-editor__dropzone">
      <BaseIcon name="upload" :size="28" />
      <span>Drop your file to load it</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.code-editor {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--color-surface);
  font-family: $font-mono;
  font-size: $text-sm;
  line-height: 1.6;
}

$editor-pad: spacing(3);

.code-editor__gutter {
  flex-shrink: 0;
  overflow: hidden;
  padding: $editor-pad spacing(2);
  text-align: right;
  color: var(--color-text-subtle);
  background: var(--color-surface-2);
  border-right: 1px solid var(--color-border);
  user-select: none;

  .code-editor__line-no {
    display: block;
    min-width: 1.75rem;
  }
}

.code-editor__area {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: $editor-pad spacing(4);
  border: 0;
  outline: none;
  resize: none;
  color: var(--color-text);
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  tab-size: 2;
  white-space: pre;
  overflow: auto;

  @include custom-scrollbar;

  &::placeholder {
    color: var(--color-text-subtle);
  }
}

.code-editor__area--readonly {
  code {
    font-family: inherit;
  }
}

.code-editor__dropzone {
  position: absolute;
  inset: spacing(2);
  z-index: $z-overlay;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: spacing(2);
  border: 2px dashed var(--color-primary);
  border-radius: $radius-md;
  background: var(--color-brand-soft);
  color: var(--color-primary);
  font-family: $font-sans;
  font-weight: 600;
  pointer-events: none;
}

.code-editor--dragging {
  outline: none;
}
</style>
