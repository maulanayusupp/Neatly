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

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'file': [file: File]
}>()

// Above this length we skip tokenizing on every keystroke and just show the
// escaped text (still visible — the textarea's own text is transparent).
const MAX_HIGHLIGHT = 30000

const gutter = ref<HTMLElement | null>(null)
const layer = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const lineNumbers = computed(() => {
  const count = Math.max(1, props.modelValue.split('\n').length)
  return Array.from({ length: count }, (_, i) => i + 1)
})

const highlighted = computed(() => {
  const code = props.modelValue
  const body = props.language && code.length <= MAX_HIGHLIGHT
    ? highlightCode(code, props.language)
    : escapeHtml(code)
  // Give a trailing newline real height so the layer matches the textarea.
  return code.endsWith('\n') ? `${body} ` : body
})

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

function onInputScroll(event: Event) {
  const el = event.target as HTMLElement
  if (layer.value) {
    layer.value.scrollTop = el.scrollTop
    layer.value.scrollLeft = el.scrollLeft
  }
  if (gutter.value) gutter.value.scrollTop = el.scrollTop
}

function onLayerScroll(event: Event) {
  if (gutter.value) gutter.value.scrollTop = (event.target as HTMLElement).scrollTop
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

    <div class="code-editor__content">
      <pre
        ref="layer"
        class="code-editor__layer"
        :class="{ 'is-readonly': readonly }"
        :tabindex="readonly ? 0 : undefined"
        :aria-label="readonly ? ariaLabel : undefined"
        :aria-hidden="readonly ? undefined : 'true'"
        @scroll="readonly && onLayerScroll($event)"
      ><code class="hljs" v-html="highlighted" /></pre>

      <textarea
        v-if="!readonly"
        class="code-editor__input"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        spellcheck="false"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        wrap="off"
        @input="onInput"
        @scroll="onInputScroll"
      />
    </div>

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

// Shared text metrics — the highlight layer and the textarea MUST match
// exactly so the transparent text lines up with the coloured tokens.
%editor-text {
  margin: 0;
  padding: spacing(3) spacing(4);
  font-family: $font-mono;
  font-size: $text-sm;
  line-height: 1.6;
  tab-size: 2;
  white-space: pre;
  word-wrap: normal;
  overflow-wrap: normal;
}

.code-editor__gutter {
  flex-shrink: 0;
  overflow: hidden;
  padding: spacing(3) spacing(2);
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

.code-editor__content {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.code-editor__layer {
  @extend %editor-text;

  position: absolute;
  inset: 0;
  overflow: hidden;
  color: var(--color-text);
  pointer-events: none;
  user-select: none;

  code {
    font-family: inherit;
  }

  &.is-readonly {
    overflow: auto;
    pointer-events: auto;
    user-select: text;
    @include custom-scrollbar;
  }
}

.code-editor__input {
  @extend %editor-text;

  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  outline: none;
  resize: none;
  overflow: auto;
  background: transparent;
  color: transparent;
  -webkit-text-fill-color: transparent;
  caret-color: var(--color-text);
  @include custom-scrollbar;

  &::placeholder {
    color: var(--color-text-subtle);
    -webkit-text-fill-color: var(--color-text-subtle);
  }

  &::selection {
    background: var(--color-brand-soft);
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
</style>
