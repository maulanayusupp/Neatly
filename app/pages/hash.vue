<script setup lang="ts">
const toast = useToast()
const input = ref('')
const results = ref<{ algo: string, hex: string }[]>([])
const copiedAlgo = ref('')

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('')
}

async function recompute(text: string) {
  if (!text) {
    results.value = []
    return
  }
  const bytes = new TextEncoder().encode(text)
  results.value = await Promise.all(
    ALGOS.map(async algo => ({ algo, hex: toHex(await crypto.subtle.digest(algo, bytes)) })),
  )
}

watch(input, value => recompute(value))

async function copy(algo: string, hex: string) {
  if (await copyText(hex)) {
    copiedAlgo.value = algo
    toast.success(`${algo} copied`)
    setTimeout(() => (copiedAlgo.value = ''), 1600)
  }
}

const pageTitle = 'Hash Generator — SHA-1, SHA-256, SHA-384 & SHA-512 Online · Neatly'
const pageDescription
  = 'Free online hash generator. Compute SHA-1, SHA-256, SHA-384 and SHA-512 hashes of any text instantly and privately in your browser. No sign-up.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/hash' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="hash"
      badge="SHA-1 · SHA-256 · SHA-384 · SHA-512"
      title="Hash"
      gradient="generator"
      lead="Generate SHA hashes of any text. Everything is computed locally in your browser using the Web Crypto API."
    />

    <section class="container tool-outlet hash">
      <div class="tool-panel">
        <label class="hash__field">
          <span class="hash__label">Text to hash</span>
          <textarea v-model="input" class="hash__input" placeholder="Type or paste text…" spellcheck="false" />
        </label>
        <div class="hash__bar">
          <BaseButton size="sm" variant="ghost" icon="sparkles" @click="input = 'The quick brown fox jumps over the lazy dog'">
            {{ $t('common.example') }}
          </BaseButton>
        </div>
      </div>

      <div v-if="results.length" class="hash__results">
        <div v-for="r in results" :key="r.algo" class="tool-panel hash__row">
          <div class="hash__algo">{{ r.algo }}</div>
          <code class="hash__hex">{{ r.hex }}</code>
          <button type="button" class="hash__copy" :aria-label="`Copy ${r.algo}`" @click="copy(r.algo, r.hex)">
            <BaseIcon :name="copiedAlgo === r.algo ? 'check' : 'copy'" :size="16" />
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.hash {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.hash__field {
  display: flex;
  flex-direction: column;
  gap: spacing(2);
}

.hash__label {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.hash__input {
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

.hash__bar {
  margin-top: spacing(3);
  display: flex;
  justify-content: flex-end;
}

.hash__results {
  display: flex;
  flex-direction: column;
  gap: spacing(3);
}

.hash__row {
  display: flex;
  align-items: center;
  gap: spacing(3);
  padding: spacing(3) spacing(4);
}

.hash__algo {
  flex-shrink: 0;
  width: 5.5rem;
  font-weight: 700;
  color: var(--color-primary);
  font-size: $text-sm;
}

.hash__hex {
  flex: 1;
  min-width: 0;
  font-family: $font-mono;
  font-size: $text-sm;
  color: var(--color-text);
  word-break: break-all;
}

.hash__copy {
  @include button-reset;
  flex-shrink: 0;
  padding: spacing(2);
  border-radius: $radius-sm;
  color: var(--color-text-muted);

  &:hover { color: var(--color-primary); }
}
</style>
