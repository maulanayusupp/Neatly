<script setup lang="ts">
import { CASE_CONVERTERS } from '~/utils/case'

const { t } = useI18n()
const toast = useToast()

const input = ref('helloWorld example text')
const copiedKey = ref('')

const results = computed(() =>
  CASE_CONVERTERS.map(c => ({ key: c.key, value: input.value ? c.fn(input.value) : '' })),
)

async function copy(key: string, value: string) {
  if (value && await copyText(value)) {
    copiedKey.value = key
    toast.success(t('common.copied'))
    setTimeout(() => (copiedKey.value = ''), 1400)
  }
}

useSeoMeta({
  title: () => t('caseConv.metaTitle'),
  description: () => t('caseConv.metaDesc'),
  ogTitle: () => t('caseConv.metaTitle'),
  ogDescription: () => t('caseConv.metaDesc'),
  twitterTitle: () => t('caseConv.metaTitle'),
  twitterDescription: () => t('caseConv.metaDesc'),
})
</script>

<template>
  <div>
    <ToolHero
      icon="code"
      :badge="$t('caseConv.badge')"
      :title="$t('caseConv.titleA')"
      :gradient="$t('caseConv.titleHl')"
      :lead="$t('caseConv.lead')"
    />

    <section class="container tool-outlet case">
      <div class="tool-panel">
        <label class="case__field">
          <span class="case__label">{{ $t('caseConv.inputLabel') }}</span>
          <textarea v-model="input" class="case__input" :placeholder="$t('caseConv.placeholder')" spellcheck="false" />
        </label>
      </div>

      <ul class="case__results" role="list">
        <li v-for="r in results" :key="r.key" class="tool-panel case__row">
          <span class="case__name">{{ r.key }}</span>
          <code class="case__value">{{ r.value }}</code>
          <button type="button" class="case__copy" :aria-label="`Copy ${r.key}`" :disabled="!r.value" @click="copy(r.key, r.value)">
            <BaseIcon :name="copiedKey === r.key ? 'check' : 'copy'" :size="16" />
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped lang="scss">
.case {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.case__field {
  display: flex;
  flex-direction: column;
  gap: spacing(2);
}

.case__label {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.case__input {
  width: 100%;
  min-height: 90px;
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

.case__results {
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: spacing(2);
}

.case__row {
  display: flex;
  align-items: center;
  gap: spacing(3);
  padding: spacing(3) spacing(4);
}

.case__name {
  flex-shrink: 0;
  width: 9rem;
  font-family: $font-mono;
  font-size: $text-sm;
  font-weight: 700;
  color: var(--color-primary);
}

.case__value {
  flex: 1;
  min-width: 0;
  font-family: $font-mono;
  font-size: $text-sm;
  color: var(--color-text);
  word-break: break-all;
}

.case__copy {
  @include button-reset;
  flex-shrink: 0;
  padding: spacing(2);
  border-radius: $radius-sm;
  color: var(--color-text-muted);

  &:hover:not(:disabled) { color: var(--color-primary); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}
</style>
