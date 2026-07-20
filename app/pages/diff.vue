<script setup lang="ts">
import { diffLines } from 'diff'

const original = ref('')
const changed = ref('')

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

const pageTitle = 'Text Diff Checker — Compare Two Texts Online Free · Neatly'
const pageDescription
  = 'Free online diff checker. Compare two texts or code snippets and see exactly which lines were added or removed, highlighted side by side. Private, instant, no sign-up.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/diff' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="columns"
      badge="Compare · line by line"
      title="Text"
      gradient="diff checker"
      lead="Paste two versions of a text or code and instantly see which lines were added or removed."
    />

    <section class="container tool-outlet diff">
      <div class="diff__inputs">
        <label class="diff__field">
          <span class="diff__label">Original</span>
          <textarea v-model="original" class="diff__area" placeholder="Paste the original text…" spellcheck="false" />
        </label>
        <label class="diff__field">
          <span class="diff__label">Changed</span>
          <textarea v-model="changed" class="diff__area" placeholder="Paste the changed text…" spellcheck="false" />
        </label>
      </div>

      <div class="tool-panel diff__result">
        <header class="diff__result-head">
          <h2 class="diff__result-title"><BaseIcon name="columns" :size="16" /> Differences</h2>
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
          <BaseIcon name="check" :size="26" /><p>The two texts are identical.</p>
        </div>
        <div v-else class="diff__state">
          <BaseIcon name="columns" :size="28" /><p>Paste both texts to see the differences here.</p>
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
