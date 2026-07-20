<script setup lang="ts">
import { diffLines } from 'diff'

const original = ref('')
const changed = ref('')

function loadExample() {
  original.value = 'function greet(name) {\n  return "Hello, " + name\n}\nconst user = "Ann"\ngreet(user)'
  changed.value = 'function greet(name) {\n  return `Hi, ${name}!`\n}\nconst user = "Bob"\ngreet(user)'
}

interface DiffLine { type: 'add' | 'del' | 'same', text: string }

const lines = computed<DiffLine[]>(() => {
  if (!original.value && !changed.value) return []
  const out: DiffLine[] = []
  for (const part of diffLines(original.value, changed.value)) {
    const type: DiffLine['type'] = part.added ? 'add' : part.removed ? 'del' : 'same'
    const raw = part.value.split('\n')
    if (raw.length && raw[raw.length - 1] === '') raw.pop()
    for (const text of raw) out.push({ type, text })
  }
  return out
})

const stats = computed(() => ({
  add: lines.value.filter(l => l.type === 'add').length,
  del: lines.value.filter(l => l.type === 'del').length,
}))

const hasDiff = computed(() => stats.value.add > 0 || stats.value.del > 0)

const { t } = useI18n()

useSeoMeta({
  title: () => t('diff.metaTitle'),
  description: () => t('diff.metaDesc'),
  ogTitle: () => t('diff.metaTitle'),
  ogDescription: () => t('diff.metaDesc'),
  twitterTitle: () => t('diff.metaTitle'),
  twitterDescription: () => t('diff.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/diff' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="columns"
      :badge="$t('diff.badge')"
      :title="$t('diff.titleA')"
      :gradient="$t('diff.titleHl')"
      :lead="$t('diff.lead')"
    />

    <section class="container tool-outlet diff">
      <div class="diff__bar">
        <BaseButton size="sm" variant="ghost" icon="sparkles" @click="loadExample">{{ $t('common.example') }}</BaseButton>
      </div>
      <div class="diff__inputs">
        <label class="diff__field">
          <span class="diff__label">{{ $t('diff.original') }}</span>
          <textarea v-model="original" class="diff__area" :placeholder="$t('diff.originalPlaceholder')" spellcheck="false" />
        </label>
        <label class="diff__field">
          <span class="diff__label">{{ $t('diff.changed') }}</span>
          <textarea v-model="changed" class="diff__area" :placeholder="$t('diff.changedPlaceholder')" spellcheck="false" />
        </label>
      </div>

      <div class="tool-panel diff__result">
        <header class="diff__result-head">
          <h2 class="diff__result-title"><BaseIcon name="columns" :size="16" /> {{ $t('diff.differences') }}</h2>
          <div v-if="lines.length" class="diff__stats">
            <span class="diff__stat diff__stat--add">+{{ stats.add }}</span>
            <span class="diff__stat diff__stat--del">−{{ stats.del }}</span>
          </div>
        </header>

        <div v-if="lines.length && hasDiff" class="diff__lines">
          <div v-for="(line, i) in lines" :key="i" class="diff__line" :class="`is-${line.type}`">
            <span class="diff__sign">{{ line.type === 'add' ? '+' : line.type === 'del' ? '−' : ' ' }}</span>
            <span class="diff__text">{{ line.text }}</span>
          </div>
        </div>
        <div v-else-if="lines.length" class="diff__state">
          <BaseIcon name="check" :size="26" /><p>{{ $t('diff.identical') }}</p>
        </div>
        <div v-else class="diff__state">
          <BaseIcon name="columns" :size="28" /><p>{{ $t('diff.empty') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.diff {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.diff__bar {
  display: flex;
  justify-content: flex-end;
}

.diff__inputs {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('md') { grid-template-columns: 1fr 1fr; }
}

.diff__field {
  display: flex;
  flex-direction: column;
  gap: spacing(2);
}

.diff__label {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.diff__area {
  width: 100%;
  min-height: 200px;
  padding: spacing(4);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
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

.diff__result {
  padding: 0;
  overflow: hidden;
}

.diff__result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: spacing(3) spacing(4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.diff__result-title {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  font-size: $text-sm;
  font-weight: 700;
}

.diff__stats {
  display: flex;
  gap: spacing(2);
  font-family: $font-mono;
  font-size: $text-sm;
  font-weight: 700;
}

.diff__stat--add { color: var(--color-success); }
.diff__stat--del { color: var(--color-danger); }

.diff__lines {
  max-height: 60vh;
  overflow: auto;
  padding: spacing(2) 0;
  font-family: $font-mono;
  font-size: $text-sm;
  line-height: 1.6;
  @include custom-scrollbar;
}

.diff__line {
  display: flex;
  gap: spacing(2);
  padding: 0 spacing(4);
  white-space: pre-wrap;
  word-break: break-word;

  &.is-add { background: var(--color-success-soft); }
  &.is-del { background: var(--color-danger-soft); }
}

.diff__sign {
  flex-shrink: 0;
  width: 1ch;
  user-select: none;
  color: var(--color-text-subtle);

  .is-add & { color: var(--color-success); }
  .is-del & { color: var(--color-danger); }
}

.diff__text {
  flex: 1;
  min-width: 0;

  .is-del & { color: var(--color-text-muted); }
}

.diff__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: spacing(2);
  padding: spacing(10) spacing(6);
  text-align: center;
  color: var(--color-text-subtle);
  font-size: $text-sm;
}
</style>
