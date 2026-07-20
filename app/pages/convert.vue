<script setup lang="ts">
import type { ConvertFormat } from '#shared/types'
import { getFormat } from '#shared/utils/formats'

const store = useConvert()
const { input, output, from, to, status, errorMessage, isLoading, hasInput } = store
const toast = useToast()

const fileInput = ref<HTMLInputElement | null>(null)
const copied = ref(false)

useSeoMeta({
  title: 'Convert JSON, YAML, CSV & XML — Free Online Converter · Neatly',
  description:
    'Convert between JSON, YAML, CSV and XML instantly. Paste your data, pick the formats, and copy or download the result. Free, fast and private.',
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatly.tools/convert' }] })

const EXT_TO_FORMAT: Record<string, ConvertFormat> = {
  json: 'json', yaml: 'yaml', yml: 'yaml', csv: 'csv', xml: 'xml', svg: 'xml',
}

async function loadFile(file: File) {
  try {
    input.value = await readFileAsText(file)
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext && EXT_TO_FORMAT[ext]) from.value = EXT_TO_FORMAT[ext]
    toast.success(`Loaded ${file.name}`)
  }
  catch {
    toast.error('Could not read that file.')
  }
}

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) loadFile(file)
  ;(event.target as HTMLInputElement).value = ''
}

async function paste() {
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      input.value = text
      toast.success('Pasted from clipboard')
    }
  }
  catch {
    toast.error('Clipboard access was blocked.')
  }
}

async function copyOutput() {
  if (await copyText(output.value)) {
    copied.value = true
    toast.success('Copied to clipboard')
    setTimeout(() => (copied.value = false), 1600)
  }
}

function downloadOutput() {
  const meta = getFormat(to.value)
  downloadText(`neatly.${meta.extension}`, output.value, meta.mime)
  toast.success('Download started')
}
</script>

<template>
  <div class="convert">
    <section class="hero">
      <div class="container hero__inner">
        <span class="hero__badge">
          <BaseIcon name="code" :size="15" />
          JSON · YAML · CSV · XML
        </span>
        <h1 class="hero__title">
          Convert <span class="text-gradient">any format</span>, instantly
        </h1>
        <p class="hero__lead">
          Transform data between JSON, YAML, CSV and XML in one click.
          Paste, pick your formats, and copy the result.
        </p>
      </div>
    </section>

    <section class="container convert__body">
      <div class="convert__toolbar">
        <FormatTabs v-model="from" label="From" />
        <button class="convert__swap" type="button" aria-label="Swap formats" @click="store.swap">
          <BaseIcon name="beautify" :size="18" />
        </button>
        <FormatTabs v-model="to" label="To" />

        <div class="convert__actions">
          <BaseButton variant="ghost" icon="sparkles" @click="store.loadExample">Example</BaseButton>
          <BaseButton variant="ghost" icon="trash" :disabled="!hasInput" @click="store.clear">Clear</BaseButton>
          <BaseButton
            variant="primary"
            size="lg"
            icon="beautify"
            :loading="isLoading"
            :disabled="!hasInput"
            @click="store.run"
          >
            Convert
          </BaseButton>
        </div>
      </div>

      <div class="convert__grid">
        <EditorPane
          v-model="input"
          :title="`Input · ${getFormat(from).label}`"
          icon="code"
          :language="from"
          placeholder="Paste your data or drop a file here…"
          @file="loadFile"
        >
          <template #actions>
            <BaseButton size="sm" variant="ghost" icon="upload" @click="fileInput?.click()">Upload</BaseButton>
            <BaseButton size="sm" variant="ghost" icon="copy" @click="paste">Paste</BaseButton>
            <input ref="fileInput" class="convert__file" type="file" accept=".json,.yaml,.yml,.csv,.xml,.svg,.txt" @change="onFileChange">
          </template>
        </EditorPane>

        <EditorPane
          :model-value="status === 'success' ? output : ''"
          :title="`Output · ${getFormat(to).label}`"
          icon="sparkles"
          :language="to"
          readonly
          empty-text="Converted output will appear here."
        >
          <template #actions>
            <BaseButton size="sm" variant="ghost" :icon="copied ? 'check' : 'copy'" :disabled="status !== 'success'" @click="copyOutput">
              {{ copied ? 'Copied' : 'Copy' }}
            </BaseButton>
            <BaseButton size="sm" variant="ghost" icon="download" :disabled="status !== 'success'" @click="downloadOutput">
              Download
            </BaseButton>
          </template>
        </EditorPane>
      </div>

      <p v-if="status === 'error'" class="convert__error">
        <BaseIcon name="alert" :size="16" />
        {{ errorMessage }}
      </p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.hero {
  padding-block: spacing(12) spacing(6);
  text-align: center;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(1.5) spacing(3.5);
  border-radius: $radius-pill;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: $text-xs;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.hero__title {
  margin-top: spacing(5);
  font-size: $text-4xl;
  letter-spacing: -0.035em;
}

.hero__lead {
  margin: spacing(4) auto 0;
  max-width: 56ch;
  color: var(--color-text-muted);
  font-size: $text-lg;
}

.convert__body {
  padding-bottom: spacing(12);
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.convert__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: spacing(3);
  padding: spacing(4);
  @include card;
}

.convert__swap {
  @include button-reset;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-primary);
  transition: background-color $transition-fast, transform $transition-fast;

  &:hover {
    background: var(--color-brand-soft);
  }
  &:active {
    transform: rotate(180deg);
  }
}

.convert__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: spacing(2);
  margin-left: auto;
}

.convert__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('lg') {
    grid-template-columns: 1fr 1fr;
  }

  :deep(.pane) {
    height: 58vh;
    min-height: 360px;
    max-height: 680px;
  }
}

.convert__file {
  display: none;
}

.convert__error {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(3) spacing(4);
  border-radius: $radius-md;
  background: var(--color-danger-soft);
  color: var(--color-danger);
  font-size: $text-sm;
  font-weight: 600;
}
</style>
