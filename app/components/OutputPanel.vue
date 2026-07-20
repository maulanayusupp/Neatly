<script setup lang="ts">
import type { LanguageId } from '#shared/types'

const store = useTransform()
const { output, status, errorMessage, effectiveLanguage, mode } = store
const toast = useToast()

const copied = ref(false)

const EXT: Record<LanguageId, string> = {
  javascript: 'js',
  css: 'css',
  html: 'html',
  json: 'json',
  xml: 'xml',
}
const MIME: Record<LanguageId, string> = {
  javascript: 'text/javascript',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
}

const lineCount = computed(() => (output.value ? output.value.split('\n').length : 0))
const byteCount = computed(() => new TextEncoder().encode(output.value).length)

async function copyOutput() {
  const ok = await copyText(output.value)
  if (ok) {
    copied.value = true
    toast.success('Copied to clipboard')
    setTimeout(() => (copied.value = false), 1600)
  }
  else {
    toast.error('Copy failed.')
  }
}

function downloadOutput() {
  const lang = effectiveLanguage.value
  const suffix = mode.value === 'minify' ? '.min' : ''
  downloadText(`neatly${suffix}.${EXT[lang]}`, output.value, MIME[lang])
  toast.success('Download started')
}
</script>

<template>
  <section class="panel" aria-label="Output">
    <header class="panel__header">
      <h2 class="panel__title">
        <BaseIcon name="sparkles" :size="16" />
        Output
      </h2>
      <p v-if="status === 'success'" class="panel__meta">
        <span>{{ formatNumber(lineCount) }} lines</span>
        <span class="panel__dot" aria-hidden="true">·</span>
        <span>{{ formatBytes(byteCount) }}</span>
      </p>
    </header>

    <div class="panel__body">
      <CodeEditor
        v-if="status === 'success'"
        :model-value="output"
        readonly
        aria-label="Transformed code"
      />

      <div v-else-if="status === 'error'" class="panel__state panel__state--error">
        <BaseIcon name="alert" :size="26" />
        <p class="panel__state-title">Couldn’t transform your code</p>
        <p class="panel__state-text">{{ errorMessage }}</p>
      </div>

      <div v-else-if="status === 'loading'" class="panel__state">
        <span class="panel__loader" aria-hidden="true" />
        <p class="panel__state-text">Working on it…</p>
      </div>

      <div v-else class="panel__state">
        <BaseIcon name="layers" :size="30" />
        <p class="panel__state-title">Your result appears here</p>
        <p class="panel__state-text">Paste code, pick a mode, then hit the button.</p>
      </div>
    </div>

    <footer class="panel__footer">
      <BaseButton
        size="sm"
        variant="ghost"
        :icon="copied ? 'check' : 'copy'"
        :disabled="status !== 'success'"
        @click="copyOutput"
      >
        {{ copied ? 'Copied' : 'Copy' }}
      </BaseButton>
      <BaseButton
        size="sm"
        variant="ghost"
        icon="download"
        :disabled="status !== 'success'"
        @click="downloadOutput"
      >
        Download
      </BaseButton>
    </footer>
  </section>
</template>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  @include card;
  overflow: hidden;
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: spacing(3);
  padding: spacing(3) spacing(4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.panel__title {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  font-size: $text-sm;
  font-weight: 700;
  color: var(--color-text);
}

.panel__meta {
  display: inline-flex;
  align-items: center;
  gap: spacing(1.5);
  font-size: $text-xs;
  color: var(--color-text-subtle);
  font-variant-numeric: tabular-nums;
}

.panel__body {
  flex: 1;
  min-height: 0;
  display: flex;
}

.panel__state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: spacing(2);
  padding: spacing(6);
  text-align: center;
  color: var(--color-text-subtle);
}

.panel__state--error {
  color: var(--color-danger);
}

.panel__state-title {
  font-family: $font-sans;
  font-size: $text-base;
  font-weight: 700;
  color: var(--color-text);
}

.panel__state--error .panel__state-title {
  color: var(--color-danger);
}

.panel__state-text {
  font-family: $font-sans;
  font-size: $text-sm;
  max-width: 32ch;
}

.panel__footer {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(1);
  padding: spacing(2);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.panel__loader {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  animation: panel-spin 0.7s linear infinite;
}

@keyframes panel-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
