<script setup lang="ts">
import { decodeJwt } from '~/utils/encoding'
import { highlightCode } from '~/utils/highlight'

const examples = [
  { label: 'Valid (HS256)', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5lYXRseSBVc2VyIiwiZW1haWwiOiJ1c2VyQG5lYXRseS5kZXYiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.sig_HS256_demo' },
  { label: 'Expired', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsIm5hbWUiOiJPbGQgU2Vzc2lvbiIsImlhdCI6MTU5MDAwMDAwMCwiZXhwIjoxNjAwMDAwMDAwfQ.sig_HS256_demo' },
  { label: 'With roles & scope', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHxhYmMiLCJuYW1lIjoiQWRhIExvdmVsYWNlIiwicm9sZXMiOlsiYWRtaW4iLCJlZGl0b3IiXSwic2NvcGUiOiJyZWFkIHdyaXRlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjIwMDAwMDAwMDB9.sig_HS256_demo' },
]

const token = ref('')

const decoded = computed(() => {
  if (!token.value.trim()) return null
  try {
    return { ...decodeJwt(token.value), error: '' }
  }
  catch (error) {
    return { header: null, payload: null, signature: '', error: (error as Error).message }
  }
})

function pretty(value: unknown) {
  return highlightCode(JSON.stringify(value, null, 2), 'json')
}

const { t } = useI18n()

const claims = computed(() => {
  const p = decoded.value?.payload as Record<string, unknown> | null
  if (!p) return []
  const rows: { label: string, value: string }[] = []
  const dateClaim = (key: string, label: string) => {
    if (typeof p[key] === 'number') {
      rows.push({ label, value: new Date((p[key] as number) * 1000).toLocaleString() })
    }
  }
  dateClaim('iat', t('jwt.issuedAt'))
  dateClaim('nbf', t('jwt.notBefore'))
  dateClaim('exp', t('jwt.expires'))
  if (typeof p.exp === 'number') {
    rows.push({ label: t('jwt.status'), value: (p.exp as number) * 1000 < Date.now() ? t('jwt.expired') : t('jwt.valid') })
  }
  return rows
})

useSeoMeta({
  title: () => t('jwt.metaTitle'),
  description: () => t('jwt.metaDesc'),
  ogTitle: () => t('jwt.metaTitle'),
  ogDescription: () => t('jwt.metaDesc'),
  twitterTitle: () => t('jwt.metaTitle'),
  twitterDescription: () => t('jwt.metaDesc'),
})
</script>

<template>
  <div>
    <ToolHero
      icon="key"
      :badge="$t('jwt.badge')"
      :title="$t('jwt.titleA')"
      :gradient="$t('jwt.titleHl')"
      :lead="$t('jwt.lead')"
    />

    <section class="container tool-outlet jwt">
      <div class="tool-panel">
        <label class="jwt__field">
          <span class="jwt__label">{{ $t('jwt.token') }}</span>
          <textarea v-model="token" class="jwt__input" placeholder="Paste your token (eyJ…)…" spellcheck="false" />
        </label>
        <ExamplePresets
          class="jwt__presets"
          :items="examples.map(e => e.label)"
          @select="i => token = examples[i].token"
        />
      </div>

      <div v-if="decoded && !decoded.error" class="jwt__grid">
        <div class="tool-panel">
          <h2 class="jwt__title">{{ $t('jwt.header') }}</h2>
          <pre class="jwt__json"><code class="hljs" v-html="pretty(decoded.header)" /></pre>
        </div>
        <div class="tool-panel">
          <h2 class="jwt__title">{{ $t('jwt.payload') }}</h2>
          <pre class="jwt__json"><code class="hljs" v-html="pretty(decoded.payload)" /></pre>
          <ul v-if="claims.length" class="jwt__claims" role="list">
            <li v-for="c in claims" :key="c.label">
              <span>{{ c.label }}</span><strong :class="{ 'is-expired': c.value === 'Expired' }">{{ c.value }}</strong>
            </li>
          </ul>
        </div>
      </div>

      <p v-else-if="decoded?.error" class="jwt__error">
        <BaseIcon name="alert" :size="16" /> {{ decoded.error }}
      </p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.jwt {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.jwt__field {
  display: flex;
  flex-direction: column;
  gap: spacing(2);
}

.jwt__label {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.jwt__input {
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
  word-break: break-all;

  &:focus { outline: none; border-color: var(--color-primary); }
}

.jwt__presets {
  margin-top: spacing(3);
}

.jwt__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('md') {
    grid-template-columns: 1fr 1fr;
  }
}

.jwt__title {
  font-size: $text-base;
  margin-bottom: spacing(3);
}

.jwt__json {
  margin: 0;
  padding: spacing(4);
  border-radius: $radius-md;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  overflow: auto;
  font-family: $font-mono;
  font-size: $text-sm;
  @include custom-scrollbar;
}

.jwt__claims {
  margin-top: spacing(4);
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: spacing(2);

  li {
    display: flex;
    justify-content: space-between;
    font-size: $text-sm;
    color: var(--color-text-muted);
  }
  strong {
    color: var(--color-text);
    &.is-expired { color: var(--color-danger); }
  }
}

.jwt__error {
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
