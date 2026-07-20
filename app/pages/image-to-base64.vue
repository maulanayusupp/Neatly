<script setup lang="ts">
import type { DataUriFormat } from '~/utils/image-base64'
import { DATA_URI_FORMATS, formatDataUri } from '~/utils/image-base64'

const { t } = useI18n()
const toast = useToast()

const dataUri = ref('')
const fileName = ref('')
const fileBytes = ref(0)
const format = ref<DataUriFormat>('datauri')
const error = ref('')
const isDragging = ref(false)
const copied = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const output = computed(() => formatDataUri(dataUri.value, format.value))

function loadFile(file: File) {
  error.value = ''
  if (!file.type.startsWith('image/')) {
    error.value = t('imgB64.notImage')
    return
  }
  fileName.value = file.name
  fileBytes.value = file.size
  const reader = new FileReader()
  reader.onload = () => { dataUri.value = String(reader.result ?? '') }
  reader.onerror = () => { error.value = t('imgB64.notImage') }
  reader.readAsDataURL(file)
}

function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) loadFile(f)
  ;(e.target as HTMLInputElement).value = ''
}
function onDrop(e: DragEvent) {
  isDragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) loadFile(f)
}
function onPaste(e: ClipboardEvent) {
  const item = Array.from(e.clipboardData?.items ?? []).find(i => i.type.startsWith('image/'))
  const f = item?.getAsFile()
  if (f) loadFile(f)
}
onMounted(() => window.addEventListener('paste', onPaste))
onBeforeUnmount(() => window.removeEventListener('paste', onPaste))

async function copy() {
  if (output.value && await copyText(output.value)) {
    copied.value = true
    toast.success(t('common.copied'))
    setTimeout(() => (copied.value = false), 1600)
  }
}

useSeoMeta({
  title: () => t('imgB64.metaTitle'),
  description: () => t('imgB64.metaDesc'),
  ogTitle: () => t('imgB64.metaTitle'),
  ogDescription: () => t('imgB64.metaDesc'),
  twitterTitle: () => t('imgB64.metaTitle'),
  twitterDescription: () => t('imgB64.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/image-to-base64' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="image"
      :badge="$t('imgB64.badge')"
      :title="$t('imgB64.titleA')"
      :gradient="$t('imgB64.titleHl')"
      :lead="$t('imgB64.lead')"
    />

    <section class="container tool-outlet ib">
      <div
        class="tool-panel ib__drop"
        :class="{ 'is-dragging': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
        @click="fileInput?.click()"
      >
        <BaseIcon name="image" :size="30" />
        <p><strong>{{ $t('imgB64.dropClick') }}</strong> {{ $t('imgB64.dropHint') }}</p>
        <input ref="fileInput" type="file" accept="image/*" class="ib__file" @change="onFileChange">
      </div>

      <p v-if="error" class="ib__error"><BaseIcon name="alert" :size="16" /> {{ error }}</p>

      <div v-if="dataUri" class="ib__result">
        <div class="tool-panel ib__preview">
          <img :src="dataUri" :alt="fileName" class="ib__img">
          <div class="ib__meta">
            <span>{{ fileName }}</span>
            <span>{{ $t('imgB64.original') }}: {{ formatBytes(fileBytes) }}</span>
            <span>{{ $t('imgB64.encoded') }}: {{ formatBytes(output.length) }}</span>
          </div>
        </div>

        <div class="tool-panel ib__out">
          <div class="ib__out-head">
            <label class="ib__format">
              <span>{{ $t('imgB64.outputFormat') }}</span>
              <select v-model="format">
                <option v-for="f in DATA_URI_FORMATS" :key="f" :value="f">{{ f === 'datauri' ? 'Data URI' : f.toUpperCase() }}</option>
              </select>
            </label>
            <BaseButton size="sm" variant="primary" :icon="copied ? 'check' : 'copy'" @click="copy">{{ copied ? $t('common.copied') : $t('common.copy') }}</BaseButton>
          </div>
          <textarea class="ib__code" :value="output" readonly spellcheck="false" />
        </div>
      </div>
      <div v-else-if="!error" class="tool-panel ib__empty">{{ $t('imgB64.empty') }}</div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.ib {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.ib__drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: spacing(2);
  padding: spacing(8);
  border: 2px dashed var(--color-border-strong);
  text-align: center;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: border-color $transition-fast, background-color $transition-fast;

  &:hover, &.is-dragging { border-color: var(--color-primary); background: var(--color-brand-soft); }
  strong { color: var(--color-text); }
}

.ib__file { display: none; }

.ib__result {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('lg') { grid-template-columns: 1fr 1.4fr; align-items: start; }
}

.ib__preview {
  display: flex;
  flex-direction: column;
  gap: spacing(3);
  align-items: center;
}

.ib__img {
  max-width: 100%;
  max-height: 240px;
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background:
    repeating-conic-gradient(var(--color-surface-2) 0% 25%, transparent 0% 50%) 50% / 20px 20px;
}

.ib__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: spacing(1) spacing(4);
  font-size: $text-xs;
  color: var(--color-text-subtle);
  font-variant-numeric: tabular-nums;
}

.ib__out-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: spacing(3);
  margin-bottom: spacing(3);
}

.ib__format {
  display: flex;
  flex-direction: column;
  gap: spacing(1.5);
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);

  select {
    padding: spacing(2) spacing(3);
    border-radius: $radius-md;
    border: 1px solid var(--color-border);
    background: var(--color-surface-2);
    color: var(--color-text);
    font-size: $text-sm;
    font-weight: 600;
    text-transform: none;
  }
}

.ib__code {
  width: 100%;
  min-height: 200px;
  padding: spacing(4);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-xs;
  line-height: 1.5;
  resize: vertical;
  word-break: break-all;
  @include custom-scrollbar;
  &:focus { outline: none; }
}

.ib__empty {
  text-align: center;
  color: var(--color-text-subtle);
  font-size: $text-sm;
  padding: spacing(8);
}

.ib__error {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  color: var(--color-danger);
  font-size: $text-sm;
  font-weight: 600;
}
</style>
