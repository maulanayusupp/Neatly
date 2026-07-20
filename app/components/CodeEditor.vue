<script setup lang="ts">
import { escapeHtml, highlightCode } from '~/utils/highlight'

const props = withDefaults(defineProps<{
  modelValue: string
  readonly?: boolean
  placeholder?: string
  ariaLabel?: string
  /** highlight.js grammar / format id (e.g. 'json', 'yaml'); undefined = plain. */
  language?: string
  /** 1-based line to flag as an error and scroll to. */
  errorLine?: number
}>(), {
  readonly: false,
  placeholder: '',
  ariaLabel: 'Code editor',
  language: undefined,
  errorLine: undefined,
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
const content = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)

const isDragging = ref(false)
const isFocused = ref(false)
const activeLine = ref(0)

// Measured metrics used to place the active-line band (px).
let lineHeightPx = 0
let padTopPx = 0

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

function measure() {
  const el = layer.value
  if (!el) return
  const cs = getComputedStyle(el)
  const lh = Number.parseFloat(cs.lineHeight)
  const pt = Number.parseFloat(cs.paddingTop)
  if (lh) lineHeightPx = lh
  if (!Number.isNaN(pt)) padTopPx = pt
  content.value?.style.setProperty('--active-line-height', `${lineHeightPx}px`)
  applyActiveLine()
}

function applyActiveLine() {
  if (!content.value || !lineHeightPx) return
  content.value.style.setProperty(
    '--active-line-top',
    `${padTopPx + activeLine.value * lineHeightPx}px`,
  )
}

function updateActiveLine() {
  const ta = inputEl.value
  if (!ta) return
  const before = ta.value.slice(0, ta.selectionStart)
  activeLine.value = before.split('\n').length - 1
  applyActiveLine()
}

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  updateActiveLine()
}

function onInputScroll(event: Event) {
  const el = event.target as HTMLElement
  if (layer.value) {
    layer.value.scrollTop = el.scrollTop
    layer.value.scrollLeft = el.scrollLeft
  }
  if (gutter.value) gutter.value.scrollTop = el.scrollTop
  content.value?.style.setProperty('--active-line-scroll', `${el.scrollTop}px`)
}

function onLayerScroll(event: Event) {
  if (gutter.value) gutter.value.scrollTop = (event.target as HTMLElement).scrollTop
}

function onFocus() {
  isFocused.value = true
  if (!lineHeightPx) measure()
  updateActiveLine()
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) emit('file', file)
}

function onDragOver() {
  if (!props.readonly) isDragging.value = true
}

function nthLineStart(text: string, line: number): number {
  let idx = 0
  for (let i = 1; i < line; i++) {
    const next = text.indexOf('\n', idx)
    if (next === -1) return idx
    idx = next + 1
  }
  return idx
}

function jumpToLine(line: number) {
  if (props.readonly) return
  if (!lineHeightPx) measure()
  content.value?.style.setProperty('--error-line-top', `${padTopPx + (line - 1) * lineHeightPx}px`)

  const ta = inputEl.value
  if (!ta) return
  const pos = nthLineStart(ta.value, line)
  ta.focus()
  ta.setSelectionRange(pos, pos)
  ta.scrollTop = Math.max(0, (line - 1) * lineHeightPx - ta.clientHeight / 2)

  if (layer.value) {
    layer.value.scrollTop = ta.scrollTop
    layer.value.scrollLeft = ta.scrollLeft
  }
  if (gutter.value) gutter.value.scrollTop = ta.scrollTop
  content.value?.style.setProperty('--active-line-scroll', `${ta.scrollTop}px`)
  updateActiveLine()
}

watch(() => props.errorLine, (line) => {
  if (line && !props.readonly) nextTick(() => jumpToLine(line))
})

onMounted(() => {
  if (!props.readonly) measure()
})
</script>

<template>
  <div
    class="code-editor"
    :class="{ 'code-editor--dragging': isDragging, 'is-focused': isFocused }"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
  >
    <div ref="gutter" class="code-editor__gutter" aria-hidden="true">
      <span
        v-for="n in lineNumbers"
        :key="n"
        class="code-editor__line-no"
        :class="{ 'is-active': !readonly && isFocused && n - 1 === activeLine }"
      >{{ n }}</span>
    </div>

    <div ref="content" class="code-editor__content">
      <span v-if="!readonly" class="code-editor__active-line" aria-hidden="true" />
      <span v-if="!readonly && errorLine" class="code-editor__error-line" aria-hidden="true" />

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
        ref="inputEl"
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
        @focus="onFocus"
        @blur="isFocused = false"
        @click="updateActiveLine"
        @keyup="updateActiveLine"
        @select="updateActiveLine"
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
    transition: color $transition-fast;

    &.is-active {
      color: var(--color-active-gutter);
      font-weight: 700;
    }
  }
}

.code-editor__content {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.code-editor__active-line {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(var(--active-line-top, 0px) - var(--active-line-scroll, 0px));
  height: var(--active-line-height, 1.6em);
  background: var(--color-active-line);
  pointer-events: none;
  opacity: 0;
  transition: opacity $transition-fast;
}

.code-editor.is-focused .code-editor__active-line {
  opacity: 1;
}

.code-editor__error-line {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(var(--error-line-top, 0px) - var(--active-line-scroll, 0px));
  height: var(--active-line-height, 1.6em);
  background: var(--color-danger-soft);
  box-shadow: inset 3px 0 0 var(--color-danger);
  pointer-events: none;
}

.code-editor__layer {
  @extend %editor-text;

  position: absolute;
  inset: 0;
  overflow: hidden;
  color: var(--color-text);
  pointer-events: none;
  user-select: none;
  background: transparent;

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
