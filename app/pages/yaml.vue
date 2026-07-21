<script setup lang="ts">
import { validateYaml } from '~/utils/yaml'

const toast = useToast()
const input = ref('')

const SAMPLE = `name: Neatly
version: 2
features:
  - beautify
  - minify
  - convert
server:
  port: 3000
  https: true
tags: [dev, tools]`

const result = computed(() => validateYaml(input.value))
const errorLine = computed(() => (!result.value.ok ? result.value.line : undefined))
const hasInput = computed(() => !!input.value.trim())

const { t } = useI18n()

useSeoMeta({
  title: () => t('yamlTool.metaTitle'),
  description: () => t('yamlTool.metaDesc'),
  ogTitle: () => t('yamlTool.metaTitle'),
  ogDescription: () => t('yamlTool.metaDesc'),
  twitterTitle: () => t('yamlTool.metaTitle'),
  twitterDescription: () => t('yamlTool.metaDesc'),
})

function format() {
  if (result.value.ok && result.value.formatted) input.value = result.value.formatted
}
function loadSample() {
  input.value = SAMPLE
}
function clear() {
  input.value = ''
}
async function copyFormatted() {
  if (result.value.ok && result.value.formatted && await copyText(result.value.formatted))
    toast.success('Copied formatted YAML')
}
async function copyJson() {
  if (result.value.ok && await copyText(JSON.stringify(result.value.value, null, 2)))
    toast.success('Copied as JSON')
}
</script>

<template>
  <div class="yv">
    <section class="hero">
      <div class="container hero__inner">
        <span class="hero__badge">
          <BaseIcon name="check" :size="15" />
          {{ $t('yamlTool.badge') }}
        </span>
        <h1 class="hero__title">
          <span class="text-gradient">{{ $t('yamlTool.titleHl') }}</span> {{ $t('yamlTool.titleB') }}
        </h1>
        <p class="hero__lead">{{ $t('yamlTool.lead') }}</p>
      </div>
    </section>

    <section class="container yv__body">
      <div class="yv__toolbar">
        <div class="yv__toolbar-group">
          <BaseButton size="sm" icon="beautify" :disabled="!result.ok || !hasInput" @click="format">{{ $t('yamlTool.format') }}</BaseButton>
          <BaseButton size="sm" variant="ghost" icon="copy" :disabled="!result.ok || !hasInput" @click="copyFormatted">{{ $t('yamlTool.copyYaml') }}</BaseButton>
          <BaseButton size="sm" variant="ghost" icon="braces" :disabled="!result.ok || !hasInput" @click="copyJson">{{ $t('yamlTool.copyJson') }}</BaseButton>
        </div>
        <div class="yv__toolbar-group">
          <BaseButton size="sm" variant="ghost" icon="sparkles" @click="loadSample">{{ $t('common.example') }}</BaseButton>
          <BaseButton size="sm" variant="ghost" icon="trash" :disabled="!input" @click="clear">{{ $t('common.clear') }}</BaseButton>
        </div>
      </div>

      <div
        v-if="hasInput"
        class="yv__status"
        :class="result.ok ? 'is-valid' : 'is-invalid'"
      >
        <BaseIcon :name="result.ok ? 'check' : 'alert'" :size="16" />
        <template v-if="result.ok">{{ $t('yamlTool.valid') }}</template>
        <template v-else>
          {{ $t('yamlTool.invalid') }} — {{ result.message }}
          <span class="yv__loc">Line {{ result.line }} · Column {{ result.column }}</span>
        </template>
      </div>

      <div class="yv__grid">
        <EditorPane
          v-model="input"
          :title="`${$t('common.input')} · YAML`"
          icon="code"
          language="yaml"
          :error-line="errorLine"
          placeholder="Paste YAML here…"
        />

        <EditorPane
          :model-value="result.ok ? result.formatted : ''"
          :title="$t('yamlTool.formatted')"
          icon="check"
          language="yaml"
          readonly
          :empty-text="$t('yamlTool.empty')"
        >
          <template #actions>
            <BaseButton size="sm" variant="ghost" icon="copy" :disabled="!result.ok || !hasInput" @click="copyFormatted">{{ $t('common.copy') }}</BaseButton>
          </template>
        </EditorPane>
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

.yv__body {
  padding-bottom: spacing(16);
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.yv__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: spacing(3);
  padding: spacing(3) spacing(4);
  @include card;
}

.yv__toolbar-group {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2);
}

.yv__grid {
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

.yv__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: spacing(2);
  padding: spacing(3) spacing(4);
  border-radius: $radius-md;
  font-size: $text-sm;
  font-weight: 600;

  &.is-valid { color: var(--color-success); background: var(--color-success-soft); }
  &.is-invalid { color: var(--color-danger); background: var(--color-danger-soft); }
}

.yv__loc {
  margin-left: auto;
  padding: spacing(1) spacing(3);
  border-radius: $radius-pill;
  background: var(--color-surface);
  font-family: $font-mono;
  font-size: $text-xs;
  font-weight: 600;
}
</style>
