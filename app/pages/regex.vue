<script setup lang="ts">
import { escapeHtml } from '~/utils/highlight'

const pattern = ref('\\b(\\w+)@(\\w+)\\.(\\w+)\\b')
const flags = reactive({ g: true, i: false, m: false, s: false })
const testStr = ref('Contact: ann@example.com or bob@neatly.dev for details.')

const { t } = useI18n()

const flagList = [
  { key: 'g', labelKey: 'flagGlobal' },
  { key: 'i', labelKey: 'flagIgnore' },
  { key: 'm', labelKey: 'flagMultiline' },
  { key: 's', labelKey: 'flagDotall' },
] as const

const flagsStr = computed(() =>
  Object.entries(flags).filter(([, on]) => on).map(([k]) => k).join(''),
)

const examples = [
  { label: 'Email', pattern: '\\b[\\w.+-]+@[\\w-]+\\.[\\w.-]+\\b', flags: 'gi', test: 'Reach us at ann@example.com or BOB@Neatly.dev today.' },
  { label: 'URL', pattern: 'https?:\\/\\/[^\\s]+', flags: 'g', test: 'Docs at https://withneatly.com and http://example.org/x?y=1.' },
  { label: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g', test: 'Hosts 192.168.0.1, 10.0.0.255 and 8.8.8.8 responded.' },
  { label: 'Phone', pattern: '\\+?\\d[\\d ()-]{7,}\\d', flags: 'g', test: 'Call +1 (555) 123-4567 or 555-987-6543.' },
  { label: 'Date (ISO)', pattern: '\\b\\d{4}-\\d{2}-\\d{2}\\b', flags: 'g', test: 'Opened 2026-07-20, due 2026-08-01.' },
  { label: 'Hex color', pattern: '#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\\b', flags: 'g', test: 'Brand #6366f1, accent #fff, invalid #12g456.' },
  { label: 'Slug', pattern: '\\b[a-z0-9]+(?:-[a-z0-9]+)*\\b', flags: 'g', test: 'my-first-post, another-slug-here, notASlug' },
  { label: 'Price', pattern: '\\$\\d+(?:\\.\\d{2})?', flags: 'g', test: 'Total $42.00 plus $3 shipping and $1250.99 tax.' },
  { label: 'Hashtag', pattern: '#[A-Za-z]\\w*', flags: 'g', test: 'Loving #Neatly and #devtools — ship faster!' },
]

function applyExample(i: number) {
  const ex = examples[i]!
  pattern.value = ex.pattern
  flags.g = ex.flags.includes('g')
  flags.i = ex.flags.includes('i')
  flags.m = ex.flags.includes('m')
  flags.s = ex.flags.includes('s')
  testStr.value = ex.test
}

const { share } = useShareLink({
  getState: () => ({ pattern: pattern.value, flags: flagsStr.value, test: testStr.value }),
  applyState: (s) => {
    if (typeof s.pattern === 'string') pattern.value = s.pattern
    if (typeof s.flags === 'string') {
      flags.g = s.flags.includes('g')
      flags.i = s.flags.includes('i')
      flags.m = s.flags.includes('m')
      flags.s = s.flags.includes('s')
    }
    if (typeof s.test === 'string') testStr.value = s.test
  },
  canShare: () => !!pattern.value,
})

const compiled = computed<{ re: RegExp | null, error: string }>(() => {
  if (!pattern.value) return { re: null, error: '' }
  try {
    return { re: new RegExp(pattern.value, flagsStr.value), error: '' }
  }
  catch (error) {
    return { re: null, error: (error as Error).message }
  }
})

function globalCopy(re: RegExp) {
  return new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`)
}

const matches = computed(() => {
  const re = compiled.value.re
  if (!re || !testStr.value) return []
  return [...testStr.value.matchAll(globalCopy(re))].map(m => ({
    match: m[0],
    index: m.index ?? 0,
    groups: m.slice(1),
  }))
})

const highlighted = computed(() => {
  const re = compiled.value.re
  if (!re || !testStr.value) return escapeHtml(testStr.value)
  let out = ''
  let last = 0
  for (const m of testStr.value.matchAll(globalCopy(re))) {
    const i = m.index ?? 0
    out += escapeHtml(testStr.value.slice(last, i))
    out += `<mark>${escapeHtml(m[0]) || '∅'}</mark>`
    last = i + m[0].length
  }
  out += escapeHtml(testStr.value.slice(last))
  return out
})

useSeoMeta({
  title: () => t('regex.metaTitle'),
  description: () => t('regex.metaDesc'),
  ogTitle: () => t('regex.metaTitle'),
  ogDescription: () => t('regex.metaDesc'),
  twitterTitle: () => t('regex.metaTitle'),
  twitterDescription: () => t('regex.metaDesc'),
})
</script>

<template>
  <div>
    <ToolHero
      icon="regex"
      :badge="$t('regex.badge')"
      :title="$t('regex.titleA')"
      :gradient="$t('regex.titleHl')"
      :lead="$t('regex.lead')"
    />

    <section class="container tool-outlet rx">
      <div class="tool-panel">
        <ExamplePresets class="rx__presets" :items="examples.map(e => e.label)" @select="applyExample" />
        <label class="rx__field">
          <span class="rx__label">{{ $t('regex.pattern') }}</span>
          <div class="rx__pattern">
            <span class="rx__slash">/</span>
            <input v-model="pattern" class="rx__input" spellcheck="false" placeholder="pattern">
            <span class="rx__slash">/{{ flagsStr }}</span>
          </div>
        </label>

        <div class="rx__flags">
          <label v-for="f in flagList" :key="f.key" class="rx__flag">
            <input v-model="flags[f.key]" type="checkbox"><code>{{ f.key }}</code><span>{{ $t(`regex.${f.labelKey}`) }}</span>
          </label>
          <BaseButton size="sm" variant="ghost" icon="share" class="rx__share" :disabled="!pattern" @click="share">{{ $t('share.button') }}</BaseButton>
        </div>

        <p v-if="compiled.error" class="rx__error"><BaseIcon name="alert" :size="16" /> {{ compiled.error }}</p>
      </div>

      <div class="tool-panel">
        <label class="rx__field">
          <span class="rx__label">{{ $t('regex.testString') }}</span>
          <textarea v-model="testStr" class="rx__area" spellcheck="false" placeholder="Text to test against…" />
        </label>
        <div class="rx__result">
          <div class="rx__result-head">
            <span class="rx__label">{{ $t('regex.matches') }}</span>
            <span class="rx__count">{{ matches.length }}</span>
          </div>
          <pre class="rx__highlight"><code v-html="highlighted" /></pre>
        </div>
      </div>

      <div v-if="matches.length" class="tool-panel">
        <h2 class="rx__title">{{ $t('regex.matchDetails') }}</h2>
        <ol class="rx__list">
          <li v-for="(m, i) in matches" :key="i">
            <span class="rx__badge">#{{ i + 1 }}</span>
            <code class="rx__mval">{{ m.match }}</code>
            <span class="rx__at">{{ $t('regex.at') }} {{ m.index }}</span>
            <span v-if="m.groups.length" class="rx__groups">
              {{ $t('regex.groups') }}: <code v-for="(g, gi) in m.groups" :key="gi">{{ g ?? '—' }}</code>
            </span>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.rx {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.rx__presets {
  margin-bottom: spacing(4);
}

.rx__field {
  display: flex;
  flex-direction: column;
  gap: spacing(2);
}

.rx__label {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.rx__pattern {
  display: flex;
  align-items: center;
  gap: spacing(1);
  padding: spacing(2) spacing(3);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  font-family: $font-mono;

  &:focus-within { border-color: var(--color-primary); }
}

.rx__slash { color: var(--color-text-subtle); }

.rx__input {
  flex: 1;
  border: 0;
  background: transparent;
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-sm;
  &:focus { outline: none; }
}

.rx__flags {
  margin-top: spacing(4);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: spacing(3);
}

.rx__share {
  margin-left: auto;
}

.rx__flag {
  display: inline-flex;
  align-items: center;
  gap: spacing(1.5);
  font-size: $text-sm;
  color: var(--color-text-muted);
  cursor: pointer;

  input { accent-color: var(--color-primary); }
  code { font-weight: 700; color: var(--color-text); }
}

.rx__area {
  width: 100%;
  min-height: 120px;
  padding: spacing(4);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-sm;
  resize: vertical;
  &:focus { outline: none; border-color: var(--color-primary); }
}

.rx__result { margin-top: spacing(4); }

.rx__result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: spacing(2);
}

.rx__count {
  font-family: $font-mono;
  font-weight: 700;
  color: var(--color-primary);
}

.rx__highlight {
  margin: 0;
  padding: spacing(4);
  border-radius: $radius-md;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  font-family: $font-mono;
  font-size: $text-sm;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 40vh;
  overflow: auto;
  @include custom-scrollbar;

  :deep(mark) {
    background: var(--color-brand-soft);
    color: var(--color-primary);
    border-radius: $radius-xs;
    padding: 1px 2px;
    font-weight: 700;
  }
}

.rx__error {
  margin-top: spacing(3);
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  color: var(--color-danger);
  font-size: $text-sm;
  font-weight: 600;
}

.rx__title { font-size: $text-base; margin-bottom: spacing(3); }

.rx__list {
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: spacing(2);

  li {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: spacing(2);
    padding: spacing(2.5) spacing(3);
    border-radius: $radius-md;
    background: var(--color-surface-2);
    font-size: $text-sm;
  }
}

.rx__badge { font-weight: 700; color: var(--color-primary); font-family: $font-mono; }
.rx__mval { font-family: $font-mono; color: var(--color-text); }
.rx__at { color: var(--color-text-subtle); font-size: $text-xs; }
.rx__groups {
  color: var(--color-text-muted);
  font-size: $text-xs;
  code {
    margin-left: spacing(1);
    font-family: $font-mono;
    color: var(--color-text);
  }
}
</style>
