<script setup lang="ts">
import {
  addLineNumbers,
  collapseSpaces,
  findReplace,
  removeEmptyLines,
  reverseLines,
  reverseText,
  sortLines,
  textStats,
  toLowerCase,
  toSentenceCase,
  toTitleCase,
  toUpperCase,
  trimLines,
  uniqueLines,
} from '~/utils/text-tools'

const { t } = useI18n()
const toast = useToast()

const SAMPLE = `The quick brown fox jumps over the lazy dog.
the QUICK brown fox jumps over the lazy dog.
banana
apple
cherry
apple

  extra    spaces   here`

const text = ref('')
const stats = computed(() => textStats(text.value))

const find = ref('')
const replace = ref('')
const useRegex = ref(false)
const caseInsensitive = ref(false)
const replaceError = ref('')

function apply(fn: (t: string) => string) {
  text.value = fn(text.value)
}

function doReplace() {
  replaceError.value = ''
  try {
    text.value = findReplace(text.value, find.value, replace.value, { regex: useRegex.value, caseInsensitive: caseInsensitive.value })
  }
  catch (error) {
    replaceError.value = (error as Error).message
  }
}

function formatReading(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

const statItems = computed(() => [
  { key: 'statWords', value: formatNumber(stats.value.words) },
  { key: 'statChars', value: formatNumber(stats.value.characters) },
  { key: 'statCharsNoSpaces', value: formatNumber(stats.value.charactersNoSpaces) },
  { key: 'statLines', value: formatNumber(stats.value.lines) },
  { key: 'statSentences', value: formatNumber(stats.value.sentences) },
  { key: 'statParagraphs', value: formatNumber(stats.value.paragraphs) },
  { key: 'statReading', value: formatReading(stats.value.readingSeconds) },
])

const lineOps = [
  { key: 'opSortAsc', fn: (t: string) => sortLines(t, 'asc') },
  { key: 'opSortDesc', fn: (t: string) => sortLines(t, 'desc') },
  { key: 'opUnique', fn: uniqueLines },
  { key: 'opReverseLines', fn: reverseLines },
  { key: 'opTrim', fn: trimLines },
  { key: 'opRemoveEmpty', fn: removeEmptyLines },
  { key: 'opLineNumbers', fn: (t: string) => addLineNumbers(t) },
]
const textOps = [
  { key: 'opCollapse', fn: collapseSpaces },
  { key: 'opReverseText', fn: reverseText },
]
const caseOps = [
  { key: 'opUpper', fn: toUpperCase },
  { key: 'opLower', fn: toLowerCase },
  { key: 'opTitle', fn: toTitleCase },
  { key: 'opSentence', fn: toSentenceCase },
]

async function copy() {
  if (text.value && await copyText(text.value))
    toast.success(t('common.copied'))
}

useSeoMeta({
  title: () => t('textTools.metaTitle'),
  description: () => t('textTools.metaDesc'),
  ogTitle: () => t('textTools.metaTitle'),
  ogDescription: () => t('textTools.metaDesc'),
  twitterTitle: () => t('textTools.metaTitle'),
  twitterDescription: () => t('textTools.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/text-tools' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="file"
      :badge="$t('textTools.badge')"
      :title="$t('textTools.titleA')"
      :gradient="$t('textTools.titleHl')"
      :lead="$t('textTools.lead')"
    />

    <section class="container tool-outlet tt">
      <div class="tool-panel tt__stats">
        <div v-for="s in statItems" :key="s.key" class="tt__stat">
          <span class="tt__stat-value">{{ s.value }}</span>
          <span class="tt__stat-label">{{ $t(`textTools.${s.key}`) }}</span>
        </div>
      </div>

      <div class="tool-panel tt__ops">
        <div class="tt__group">
          <span class="tt__group-label">{{ $t('textTools.grpLines') }}</span>
          <div class="tt__chips">
            <button v-for="op in lineOps" :key="op.key" type="button" class="tt__chip" @click="apply(op.fn)">{{ $t(`textTools.${op.key}`) }}</button>
          </div>
        </div>
        <div class="tt__group">
          <span class="tt__group-label">{{ $t('textTools.grpCase') }}</span>
          <div class="tt__chips">
            <button v-for="op in caseOps" :key="op.key" type="button" class="tt__chip" @click="apply(op.fn)">{{ $t(`textTools.${op.key}`) }}</button>
          </div>
        </div>
        <div class="tt__group">
          <span class="tt__group-label">{{ $t('textTools.grpText') }}</span>
          <div class="tt__chips">
            <button v-for="op in textOps" :key="op.key" type="button" class="tt__chip" @click="apply(op.fn)">{{ $t(`textTools.${op.key}`) }}</button>
          </div>
        </div>

        <div class="tt__group tt__group--replace">
          <span class="tt__group-label">{{ $t('textTools.grpReplace') }}</span>
          <div class="tt__replace">
            <input v-model="find" class="tt__field" spellcheck="false" :placeholder="$t('textTools.findPlaceholder')">
            <input v-model="replace" class="tt__field" spellcheck="false" :placeholder="$t('textTools.replacePlaceholder')">
            <label class="tt__toggle"><input v-model="useRegex" type="checkbox"> {{ $t('textTools.regexLabel') }}</label>
            <label class="tt__toggle"><input v-model="caseInsensitive" type="checkbox"> {{ $t('textTools.caseLabel') }}</label>
            <BaseButton size="sm" icon="refresh" :disabled="!find" @click="doReplace">{{ $t('textTools.replaceBtn') }}</BaseButton>
          </div>
          <p v-if="replaceError" class="tt__error"><BaseIcon name="alert" :size="14" /> {{ replaceError }}</p>
        </div>
      </div>

      <div class="tool-panel tt__editor">
        <textarea
          v-model="text"
          class="tt__area"
          spellcheck="false"
          :placeholder="$t('textTools.placeholder')"
        />
        <div class="tt__bar">
          <BaseButton size="sm" variant="ghost" icon="sparkles" @click="text = SAMPLE">{{ $t('common.example') }}</BaseButton>
          <BaseButton size="sm" variant="ghost" icon="copy" :disabled="!text" @click="copy">{{ $t('common.copy') }}</BaseButton>
          <BaseButton size="sm" variant="ghost" icon="trash" :disabled="!text" @click="text = ''">{{ $t('common.clear') }}</BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.tt {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.tt__stats {
  display: grid;
  gap: spacing(3);
  grid-template-columns: repeat(2, 1fr);

  @include respond('sm') { grid-template-columns: repeat(4, 1fr); }
  @include respond('lg') { grid-template-columns: repeat(7, 1fr); }
}

.tt__stat {
  display: flex;
  flex-direction: column;
  gap: spacing(1);
  text-align: center;
  padding: spacing(2);
  border-radius: $radius-md;
  background: var(--color-surface-2);
}

.tt__stat-value {
  font-size: $text-xl;
  font-weight: 700;
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
}

.tt__stat-label {
  font-size: $text-xs;
  color: var(--color-text-subtle);
}

.tt__ops {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.tt__group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: spacing(2) spacing(3);
}

.tt__group-label {
  min-width: 5rem;
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.tt__chips {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2);
}

.tt__chip {
  @include button-reset;
  padding: spacing(1.5) spacing(3);
  border-radius: $radius-pill;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  font-size: $text-sm;
  color: var(--color-text-muted);
  transition: color $transition-fast, border-color $transition-fast, background $transition-fast;

  &:hover { color: var(--color-primary); border-color: var(--color-primary); background: var(--color-brand-soft); }
}

.tt__group--replace { align-items: flex-start; }

.tt__replace {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: spacing(2);
}

.tt__field {
  min-width: 180px;
  padding: spacing(2) spacing(3);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-sm;

  &:focus { outline: none; border-color: var(--color-primary); }
}

.tt__toggle {
  display: inline-flex;
  align-items: center;
  gap: spacing(1.5);
  font-size: $text-sm;
  color: var(--color-text-muted);

  input { accent-color: var(--color-primary); }
}

.tt__error {
  display: inline-flex;
  align-items: center;
  gap: spacing(1.5);
  margin-top: spacing(1);
  color: var(--color-danger);
  font-size: $text-xs;
  font-weight: 600;
}

.tt__editor {
  display: flex;
  flex-direction: column;
  gap: spacing(3);
}

.tt__area {
  width: 100%;
  min-height: 320px;
  padding: spacing(4);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-sm;
  line-height: 1.6;
  resize: vertical;
  white-space: pre;
  overflow: auto;
  @include custom-scrollbar;

  &:focus { outline: none; border-color: var(--color-primary); }
}

.tt__bar {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2);
}
</style>
