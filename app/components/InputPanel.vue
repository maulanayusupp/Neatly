<script setup lang="ts">
import { detectLanguageByFilename } from '#shared/utils/languages'

const store = useTransform()
const { input, effectiveLanguage } = store
const toast = useToast()

const fileInput = ref<HTMLInputElement | null>(null)

const byteCount = computed(() => new TextEncoder().encode(input.value).length)
const lineCount = computed(() => (input.value ? input.value.split('\n').length : 0))

async function loadFile(file: File) {
  try {
    input.value = await readFileAsText(file)
    const detected = detectLanguageByFilename(file.name)
    if (detected) store.selectLanguage(detected)
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

async function pasteFromClipboard() {
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
</script>

<template>
  <section class="panel" aria-label="Input">
    <header class="panel__header">
      <h2 class="panel__title">
        <BaseIcon name="code" :size="16" />
        Input
      </h2>
      <p class="panel__meta">
        <span>{{ formatNumber(lineCount) }} lines</span>
        <span class="panel__dot" aria-hidden="true">·</span>
        <span>{{ formatBytes(byteCount) }}</span>
      </p>
    </header>

    <div class="panel__body">
      <CodeEditor
        v-model="input"
        :language="effectiveLanguage"
        aria-label="Paste your code here"
        placeholder="Paste your code or drop a file here…"
        @file="loadFile"
      />
    </div>

    <footer class="panel__footer">
      <BaseButton size="sm" variant="ghost" icon="upload" @click="fileInput?.click()">
        Upload
      </BaseButton>
      <BaseButton size="sm" variant="ghost" icon="copy" @click="pasteFromClipboard">
        Paste
      </BaseButton>
      <BaseButton
        size="sm"
        variant="ghost"
        icon="trash"
        :disabled="!input"
        @click="store.clear"
      >
        Clear
      </BaseButton>
      <input
        ref="fileInput"
        class="panel__file"
        type="file"
        accept=".js,.mjs,.cjs,.jsx,.ts,.tsx,.css,.scss,.less,.html,.htm,.xml,.svg,.json,.txt"
        @change="onFileChange"
      >
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
  letter-spacing: 0;
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
}

.panel__footer {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(1);
  padding: spacing(2) spacing(2);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.panel__file {
  display: none;
}
</style>
