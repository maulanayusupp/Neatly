<script setup lang="ts">
import type { UrlParam } from '~/utils/url-parser'
import { buildUrl, parseUrl } from '~/utils/url-parser'

const { t } = useI18n()
const toast = useToast()

const SAMPLE = 'https://shop.example.com:443/products/shoes?color=red&size=42&q=running%20shoes&ref=newsletter#reviews'

const input = ref('')
const params = ref<UrlParam[]>([])

const parsed = computed(() => parseUrl(input.value))

// Reseed the editable params whenever the parsed URL changes.
watch(parsed, (p) => {
  params.value = p.params.map(x => ({ ...x }))
}, { immediate: true })

const rebuilt = computed(() => buildUrl(parsed.value, params.value))

const components = computed(() => {
  const p = parsed.value
  if (!p.valid)
    return []
  const rows: { key: string, value: string }[] = [
    { key: 'protocol', value: p.protocol },
    { key: 'hostname', value: p.hostname },
    { key: 'port', value: p.port || '—' },
    { key: 'path', value: p.pathname },
    { key: 'query', value: p.search || '—' },
    { key: 'fragment', value: p.hash || '—' },
    { key: 'origin', value: p.origin },
  ]
  if (p.username)
    rows.push({ key: 'username', value: p.username })
  if (p.password)
    rows.push({ key: 'password', value: p.password })
  return rows
})

function addParam() {
  params.value.push({ key: '', value: '' })
}
function removeParam(i: number) {
  params.value.splice(i, 1)
}
async function copy(value: string) {
  if (value && value !== '—' && await copyText(value))
    toast.success(t('common.copied'))
}

useSeoMeta({
  title: () => t('urlParser.metaTitle'),
  description: () => t('urlParser.metaDesc'),
  ogTitle: () => t('urlParser.metaTitle'),
  ogDescription: () => t('urlParser.metaDesc'),
  twitterTitle: () => t('urlParser.metaTitle'),
  twitterDescription: () => t('urlParser.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/url-parser' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="link"
      :badge="$t('urlParser.badge')"
      :title="$t('urlParser.titleA')"
      :gradient="$t('urlParser.titleHl')"
      :lead="$t('urlParser.lead')"
    />

    <section class="container tool-outlet up">
      <div class="tool-panel up__inbar">
        <input v-model="input" class="up__input" spellcheck="false" :placeholder="$t('urlParser.placeholder')">
        <BaseButton size="sm" variant="ghost" icon="sparkles" @click="input = SAMPLE">{{ $t('common.example') }}</BaseButton>
      </div>

      <p v-if="input && !parsed.valid" class="up__error"><BaseIcon name="alert" :size="16" /> {{ $t('urlParser.invalid') }}</p>

      <template v-if="parsed.valid">
        <div class="tool-panel up__section">
          <h2 class="up__h">{{ $t('urlParser.components') }}</h2>
          <div class="up__grid">
            <button v-for="c in components" :key="c.key" type="button" class="up__cell" @click="copy(c.value)">
              <span class="up__cell-key">{{ $t(`urlParser.parts.${c.key}`) }}</span>
              <span class="up__cell-val">{{ c.value }}</span>
            </button>
          </div>
        </div>

        <div class="tool-panel up__section">
          <div class="up__bar">
            <h2 class="up__h">{{ $t('urlParser.queryParams') }}</h2>
            <BaseButton size="sm" variant="ghost" icon="plus" @click="addParam">{{ $t('urlParser.addParam') }}</BaseButton>
          </div>
          <div v-if="params.length" class="up__params">
            <div v-for="(p, i) in params" :key="i" class="up__param">
              <input v-model="p.key" class="up__pf" spellcheck="false" :placeholder="$t('urlParser.key')">
              <input v-model="p.value" class="up__pf" spellcheck="false" :placeholder="$t('urlParser.value')">
              <button type="button" class="up__del" :aria-label="$t('common.clear')" @click="removeParam(i)"><BaseIcon name="trash" :size="16" /></button>
            </div>
          </div>
          <p v-else class="up__none">{{ $t('urlParser.noParams') }}</p>
        </div>

        <div class="tool-panel up__section">
          <div class="up__bar">
            <h2 class="up__h">{{ $t('urlParser.rebuilt') }}</h2>
            <BaseButton size="sm" variant="ghost" icon="copy" @click="copy(rebuilt)">{{ $t('common.copy') }}</BaseButton>
          </div>
          <pre class="up__rebuilt"><code>{{ rebuilt }}</code></pre>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped lang="scss">
.up {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.up__inbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: spacing(3);
}

.up__input {
  flex: 1;
  min-width: 240px;
  padding: spacing(3) spacing(4);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-sm;

  &:focus { outline: none; border-color: var(--color-primary); }
}

.up__error {
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

.up__section { display: flex; flex-direction: column; gap: spacing(3); }

.up__bar { display: flex; align-items: center; justify-content: space-between; gap: spacing(3); }

.up__h {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.up__grid {
  display: grid;
  gap: spacing(2);
  grid-template-columns: 1fr;

  @include respond('sm') { grid-template-columns: 1fr 1fr; }
  @include respond('lg') { grid-template-columns: 1fr 1fr 1fr; }
}

.up__cell {
  @include button-reset;
  display: flex;
  flex-direction: column;
  gap: spacing(1);
  padding: spacing(2.5) spacing(3);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  text-align: left;

  &:hover { border-color: var(--color-primary); }
}

.up__cell-key {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.up__cell-val {
  font-family: $font-mono;
  font-size: $text-sm;
  color: var(--color-text);
  word-break: break-all;
}

.up__params { display: flex; flex-direction: column; gap: spacing(2); }

.up__param { display: grid; grid-template-columns: 1fr 1.5fr auto; gap: spacing(2); }

.up__pf {
  padding: spacing(2) spacing(3);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-sm;

  &:focus { outline: none; border-color: var(--color-primary); }
}

.up__del {
  @include button-reset;
  padding: spacing(2);
  border-radius: $radius-sm;
  color: var(--color-text-muted);
  &:hover { color: var(--color-danger); background: var(--color-danger-soft); }
}

.up__none { color: var(--color-text-subtle); font-size: $text-sm; }

.up__rebuilt {
  margin: 0;
  padding: spacing(3) spacing(4);
  border-radius: $radius-md;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  overflow: auto;
  font-family: $font-mono;
  font-size: $text-sm;
  color: var(--color-primary);
  white-space: pre-wrap;
  word-break: break-all;
  @include custom-scrollbar;
}
</style>
