<script setup lang="ts">
import { BASES, parseInBase, toBase } from '~/utils/number-base'

const { t } = useI18n()
const toast = useToast()

const fields = reactive<Record<string, string>>({ dec: '255', hex: '', oct: '', bin: '' })
const errorKey = ref('')
const copiedKey = ref('')

function update(fromKey: string) {
  const from = BASES.find(b => b.key === fromKey)!
  const value = parseInBase(fields[fromKey]!, from.base)
  if (value === null) {
    errorKey.value = fromKey
    return
  }
  errorKey.value = ''
  for (const b of BASES) {
    if (b.key !== fromKey) fields[b.key] = toBase(value, b.base)
  }
}

onMounted(() => update('dec'))

async function copy(key: string) {
  if (fields[key] && await copyText(fields[key]!)) {
    copiedKey.value = key
    toast.success(t('common.copied'))
    setTimeout(() => (copiedKey.value = ''), 1400)
  }
}

useSeoMeta({
  title: () => t('numberBase.metaTitle'),
  description: () => t('numberBase.metaDesc'),
  ogTitle: () => t('numberBase.metaTitle'),
  ogDescription: () => t('numberBase.metaDesc'),
  twitterTitle: () => t('numberBase.metaTitle'),
  twitterDescription: () => t('numberBase.metaDesc'),
})
</script>

<template>
  <div>
    <ToolHero
      icon="hash"
      :badge="$t('numberBase.badge')"
      :title="$t('numberBase.titleA')"
      :gradient="$t('numberBase.titleHl')"
      :lead="$t('numberBase.lead')"
    />

    <section class="container tool-outlet nb">
      <div class="tool-panel nb__grid">
        <div v-for="b in BASES" :key="b.key" class="nb__field" :class="{ 'has-error': errorKey === b.key }">
          <label :for="`nb-${b.key}`" class="nb__label">{{ b.label }} <span>base {{ b.base }}</span></label>
          <div class="nb__input-wrap">
            <input
              :id="`nb-${b.key}`"
              v-model="fields[b.key]"
              class="nb__input"
              spellcheck="false"
              autocomplete="off"
              @input="update(b.key)"
            >
            <button type="button" class="nb__copy" :aria-label="`Copy ${b.label}`" @click="copy(b.key)">
              <BaseIcon :name="copiedKey === b.key ? 'check' : 'copy'" :size="15" />
            </button>
          </div>
        </div>
      </div>
      <p v-if="errorKey" class="nb__error">
        <BaseIcon name="alert" :size="16" /> {{ $t('numberBase.invalid') }}
      </p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.nb__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('sm') { grid-template-columns: 1fr 1fr; }
}

.nb__field {
  display: flex;
  flex-direction: column;
  gap: spacing(2);

  &.has-error .nb__input-wrap { border-color: var(--color-danger); }
}

.nb__label {
  font-size: $text-sm;
  font-weight: 700;
  color: var(--color-text);

  span {
    margin-left: spacing(1);
    font-weight: 500;
    color: var(--color-text-subtle);
    font-size: $text-xs;
  }
}

.nb__input-wrap {
  display: flex;
  align-items: center;
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);

  &:focus-within { border-color: var(--color-primary); }
}

.nb__input {
  flex: 1;
  min-width: 0;
  padding: spacing(3) spacing(4);
  border: 0;
  background: transparent;
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-base;
  &:focus { outline: none; }
}

.nb__copy {
  @include button-reset;
  padding: spacing(2) spacing(3);
  color: var(--color-text-muted);
  &:hover { color: var(--color-primary); }
}

.nb__error {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  margin-top: spacing(3);
  color: var(--color-danger);
  font-size: $text-sm;
  font-weight: 600;
}
</style>
