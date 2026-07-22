<script setup lang="ts">
import { jsonStats, parseJson, sortKeysDeep } from '~/utils/json-tools'

const toast = useToast()
const input = ref('')

const SAMPLE = '{\n  "name": "Neatly",\n  "version": 2,\n  "features": ["beautify", "minify", "convert"],\n  "author": { "name": "Ann", "active": true },\n  "tags": null\n}'

const result = computed(() => (input.value.trim() ? parseJson(input.value) : null))
const stats = computed(() => (result.value?.ok ? jsonStats(result.value.value) : null))
const errorLine = computed(() => (result.value && !result.value.ok ? result.value.error.line : undefined))

const { t } = useI18n()

useSeoMeta({
  title: () => t('jsonViewer.metaTitle'),
  description: () => t('jsonViewer.metaDesc'),
  ogTitle: () => t('jsonViewer.metaTitle'),
  ogDescription: () => t('jsonViewer.metaDesc'),
  twitterTitle: () => t('jsonViewer.metaTitle'),
  twitterDescription: () => t('jsonViewer.metaDesc'),
})

function format() {
  if (result.value?.ok) input.value = JSON.stringify(result.value.value, null, 2)
}
function minify() {
  if (result.value?.ok) input.value = JSON.stringify(result.value.value)
}
function sortKeys() {
  if (result.value?.ok) {
    input.value = JSON.stringify(sortKeysDeep(result.value.value), null, 2)
    toast.success('Keys sorted')
  }
}
function loadSample() {
  input.value = SAMPLE
}
function clear() {
  input.value = ''
}
async function copyTree() {
  if (result.value?.ok && await copyText(JSON.stringify(result.value.value, null, 2))) {
    toast.success('Copied formatted JSON')
  }
}

const { share } = useShareLink({
  getState: () => ({ input: input.value }),
  applyState: (s) => { if (typeof s.input === 'string') input.value = s.input },
  canShare: () => !!input.value.trim(),
})
</script>

<template>
  <div class="jv">
    <section class="hero">
      <div class="container hero__inner">
        <span class="hero__badge">
          <BaseIcon name="tree" :size="15" />
          {{ $t('jsonViewer.badge') }}
        </span>
        <h1 class="hero__title">
          <span class="text-gradient">{{ $t('jsonViewer.titleHl') }}</span> {{ $t('jsonViewer.titleB') }}
        </h1>
        <p class="hero__lead">{{ $t('jsonViewer.lead') }}</p>
      </div>
    </section>

    <section class="container jv__body">
      <div class="jv__toolbar">
        <div class="jv__toolbar-group">
          <BaseButton size="sm" icon="beautify" :disabled="!result?.ok" @click="format">{{ $t('jsonViewer.format') }}</BaseButton>
          <BaseButton size="sm" icon="minify" :disabled="!result?.ok" @click="minify">{{ $t('jsonViewer.minify') }}</BaseButton>
          <BaseButton size="sm" icon="layers" :disabled="!result?.ok" @click="sortKeys">{{ $t('jsonViewer.sortKeys') }}</BaseButton>
        </div>
        <div class="jv__toolbar-group">
          <BaseButton size="sm" variant="ghost" icon="sparkles" @click="loadSample">{{ $t('jsonViewer.sample') }}</BaseButton>
          <BaseButton size="sm" variant="ghost" icon="share" :disabled="!input" @click="share">{{ $t('share.button') }}</BaseButton>
          <BaseButton size="sm" variant="ghost" icon="trash" :disabled="!input" @click="clear">{{ $t('common.clear') }}</BaseButton>
        </div>
      </div>

      <div class="jv__grid">
        <EditorPane
          v-model="input"
          :title="`${$t('common.input')} · JSON`"
          icon="code"
          language="json"
          :error-line="errorLine"
          placeholder="Paste JSON here…"
        />

        <section class="jv__viewer">
          <header class="jv__viewer-header">
            <h2 class="jv__viewer-title"><BaseIcon name="tree" :size="16" /> {{ $t('jsonViewer.tree') }}</h2>
            <span
              v-if="result"
              class="jv__badge"
              :class="result.ok ? 'is-valid' : 'is-invalid'"
            >
              <BaseIcon :name="result.ok ? 'check' : 'alert'" :size="13" />
              {{ result.ok ? $t('jsonViewer.valid') : $t('jsonViewer.invalid') }}
            </span>
          </header>

          <div v-if="stats" class="jv__stats">
            <span>{{ formatNumber(stats.keys) }} {{ $t('jsonViewer.keys') }}</span>
            <span>{{ formatNumber(stats.nodes) }} {{ $t('jsonViewer.nodes') }}</span>
            <span>{{ $t('jsonViewer.depth') }} {{ stats.depth }}</span>
            <button type="button" class="jv__copy" @click="copyTree">
              <BaseIcon name="copy" :size="14" /> {{ $t('common.copy') }}
            </button>
          </div>

          <div class="jv__viewer-body">
            <JsonTree v-if="result?.ok" :data="result.value" />
            <div v-else-if="result && !result.ok" class="jv__state jv__state--error">
              <BaseIcon name="alert" :size="24" />
              <p>{{ result.error.message }}</p>
              <span class="jv__loc">Line {{ result.error.line }} · Column {{ result.error.column }}</span>
            </div>
            <div v-else class="jv__state">
              <BaseIcon name="tree" :size="28" />
              <p>{{ $t('jsonViewer.empty') }}</p>
            </div>
          </div>
        </section>
      </div>
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
  max-width: 58ch;
  color: var(--color-text-muted);
  font-size: $text-lg;
}

.jv__body {
  padding-bottom: spacing(16);
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.jv__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: spacing(3);
  padding: spacing(3) spacing(4);
  @include card;
}

.jv__toolbar-group {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2);
}

.jv__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('lg') {
    grid-template-columns: 1fr 1fr;
  }

  :deep(.pane) {
    height: 62vh;
    min-height: 400px;
  }
}

.jv__viewer {
  display: flex;
  flex-direction: column;
  min-height: 400px;
  height: 62vh;
  @include card;
  overflow: hidden;
}

.jv__viewer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: spacing(3) spacing(4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.jv__viewer-title {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  font-size: $text-sm;
  font-weight: 700;
}

.jv__badge {
  display: inline-flex;
  align-items: center;
  gap: spacing(1);
  padding: spacing(1) spacing(2.5);
  border-radius: $radius-pill;
  font-size: $text-xs;
  font-weight: 700;

  &.is-valid { color: var(--color-success); background: var(--color-success-soft); }
  &.is-invalid { color: var(--color-danger); background: var(--color-danger-soft); }
}

.jv__stats {
  display: flex;
  align-items: center;
  gap: spacing(3);
  padding: spacing(2) spacing(4);
  border-bottom: 1px solid var(--color-border);
  font-size: $text-xs;
  color: var(--color-text-subtle);
  font-variant-numeric: tabular-nums;
}

.jv__copy {
  @include button-reset;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: spacing(1);
  color: var(--color-text-muted);
  font-weight: 600;

  &:hover { color: var(--color-primary); }
}

.jv__viewer-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: spacing(3) spacing(4);
  @include custom-scrollbar;
}

.jv__state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: spacing(2);
  text-align: center;
  color: var(--color-text-subtle);
  font-family: $font-sans;
  font-size: $text-sm;
}

.jv__state--error { color: var(--color-danger); }

.jv__loc {
  padding: spacing(1) spacing(3);
  border-radius: $radius-pill;
  background: var(--color-danger-soft);
  font-family: $font-mono;
  font-size: $text-xs;
  font-weight: 600;
}
</style>
