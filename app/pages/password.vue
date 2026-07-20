<script setup lang="ts">
import type { PasswordOptions } from '~/utils/password'
import { buildPool, generatePassword, passwordStrength } from '~/utils/password'

const { t } = useI18n()
const toast = useToast()

const opts = reactive<PasswordOptions>({
  length: 16,
  lower: true,
  upper: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
})

const password = ref('')
const copied = ref(false)

const hasSet = computed(() => buildPool(opts).length > 0)
const strength = computed(() => passwordStrength(password.value))
const strengthKey = computed(() => (['weak', 'weak', 'fair', 'good', 'strong'] as const)[strength.value])

function regenerate() {
  password.value = generatePassword(opts)
}

// Regenerate whenever options change (client-only; avoids SSR randomness).
onMounted(regenerate)
watch(opts, regenerate)

async function copy() {
  if (password.value && await copyText(password.value)) {
    copied.value = true
    toast.success(t('common.copied'))
    setTimeout(() => (copied.value = false), 1600)
  }
}

const toggles: { key: keyof PasswordOptions, label: string }[] = [
  { key: 'lower', label: 'lowercase' },
  { key: 'upper', label: 'uppercase' },
  { key: 'numbers', label: 'numbers' },
  { key: 'symbols', label: 'symbols' },
  { key: 'excludeAmbiguous', label: 'excludeAmbiguous' },
]

useSeoMeta({
  title: () => t('passwordGen.metaTitle'),
  description: () => t('passwordGen.metaDesc'),
  ogTitle: () => t('passwordGen.metaTitle'),
  ogDescription: () => t('passwordGen.metaDesc'),
  twitterTitle: () => t('passwordGen.metaTitle'),
  twitterDescription: () => t('passwordGen.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/password' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="lock"
      :badge="$t('passwordGen.badge')"
      :title="$t('passwordGen.titleA')"
      :gradient="$t('passwordGen.titleHl')"
      :lead="$t('passwordGen.lead')"
    />

    <section class="container tool-outlet pw">
      <div class="tool-panel pw__output-panel">
        <output class="pw__output">{{ password || '•'.repeat(opts.length) }}</output>
        <div class="pw__output-actions">
          <BaseButton icon="refresh" :disabled="!hasSet" @click="regenerate">{{ $t('passwordGen.generate') }}</BaseButton>
          <BaseButton variant="secondary" :icon="copied ? 'check' : 'copy'" :disabled="!password" @click="copy">
            {{ copied ? $t('common.copied') : $t('common.copy') }}
          </BaseButton>
        </div>

        <div v-if="hasSet" class="pw__strength">
          <div class="pw__meter" :class="`is-${strength}`" aria-hidden="true">
            <span v-for="i in 4" :key="i" class="pw__bar" :class="{ 'is-on': i <= strength }" />
          </div>
          <span class="pw__strength-label">{{ $t('passwordGen.strength') }}: {{ $t(`passwordGen.${strengthKey}`) }}</span>
        </div>
        <p v-else class="pw__error"><BaseIcon name="alert" :size="16" /> {{ $t('passwordGen.noSet') }}</p>
      </div>

      <div class="tool-panel pw__options">
        <label class="pw__length">
          <span>{{ $t('passwordGen.length') }}: <strong>{{ opts.length }}</strong></span>
          <input v-model.number="opts.length" type="range" min="4" max="64">
        </label>

        <div class="pw__toggles">
          <label v-for="tg in toggles" :key="tg.key" class="pw__toggle">
            <input v-model="opts[tg.key]" type="checkbox">
            <span>{{ $t(`passwordGen.${tg.label}`) }}</span>
          </label>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.pw {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.pw__output-panel {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.pw__output {
  display: block;
  padding: spacing(5);
  border-radius: $radius-md;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  font-family: $font-mono;
  font-size: $text-2xl;
  color: var(--color-text);
  word-break: break-all;
  text-align: center;
}

.pw__output-actions {
  display: flex;
  gap: spacing(2);

  :deep(.btn) { flex: 1; }
}

.pw__strength {
  display: flex;
  align-items: center;
  gap: spacing(3);
}

.pw__meter {
  display: flex;
  gap: spacing(1);
  flex: 1;
}

.pw__bar {
  flex: 1;
  height: 6px;
  border-radius: $radius-pill;
  background: var(--color-surface-3);
  transition: background-color $transition-fast;

  &.is-on { background: var(--color-primary); }
}

.pw__meter.is-1 .pw__bar.is-on { background: var(--color-danger); }
.pw__meter.is-2 .pw__bar.is-on { background: #f0883e; }
.pw__meter.is-3 .pw__bar.is-on { background: #eab308; }
.pw__meter.is-4 .pw__bar.is-on { background: var(--color-success); }

.pw__strength-label {
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.pw__error {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  color: var(--color-danger);
  font-size: $text-sm;
  font-weight: 600;
}

.pw__length {
  display: flex;
  flex-direction: column;
  gap: spacing(2);
  font-size: $text-sm;
  color: var(--color-text-muted);

  strong { color: var(--color-text); }
  input { width: 100%; accent-color: var(--color-primary); }
}

.pw__toggles {
  margin-top: spacing(5);
  display: grid;
  gap: spacing(3);
  grid-template-columns: 1fr;

  @include respond('sm') { grid-template-columns: 1fr 1fr; }
}

.pw__toggle {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  font-size: $text-sm;
  color: var(--color-text);
  cursor: pointer;

  input { width: 18px; height: 18px; accent-color: var(--color-primary); }
}
</style>
