<script setup lang="ts">
import { classifyScan } from '~/utils/scan'

const store = useQrScanner()
const { result, history } = store
const toast = useToast()

const copied = ref(false)
const content = computed(() => (result.value ? classifyScan(result.value.text) : null))

async function copy() {
  if (!result.value) return
  if (await copyText(result.value.text)) {
    copied.value = true
    toast.success('Copied to clipboard')
    setTimeout(() => (copied.value = false), 1600)
  }
}

function show(text: string) {
  const item = history.value.find(h => h.text === text)
  if (item) result.value = item
}
</script>

<template>
  <section class="scan-result" aria-label="Scan result">
    <header class="scan-result__header">
      <h2 class="scan-result__title">
        <BaseIcon name="qr" :size="16" />
        {{ $t('scan.result') }}
      </h2>
      <span v-if="result" class="scan-result__format">{{ result.format }}</span>
    </header>

    <div class="scan-result__body">
      <template v-if="result && content">
        <span class="scan-result__chip">
          <BaseIcon :name="content.icon" :size="14" />
          {{ $t(`scan.type.${content.kind}`) }}
        </span>

        <p class="scan-result__value">{{ result.text }}</p>

        <div class="scan-result__actions">
          <BaseButton size="sm" variant="primary" :icon="copied ? 'check' : 'copy'" @click="copy">
            {{ copied ? $t('common.copied') : $t('common.copy') }}
          </BaseButton>
          <a
            v-if="content.href"
            class="scan-result__open"
            :href="content.href"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <BaseIcon :name="content.icon" :size="16" />
            {{ $t('scan.open') }} {{ $t(`scan.type.${content.kind}`).toLowerCase() }}
          </a>
        </div>
      </template>

      <div v-else class="scan-result__empty">
        <BaseIcon name="qr" :size="30" />
        <p>{{ $t('scan.empty') }}</p>
      </div>
    </div>

    <footer v-if="history.length > 1" class="scan-result__history">
      <h3 class="scan-result__history-title">{{ $t('scan.recent') }}</h3>
      <ul role="list">
        <li v-for="item in history" :key="item.text">
          <button type="button" @click="show(item.text)">
            <span class="scan-result__history-format">{{ item.format }}</span>
            <span class="scan-result__history-text">{{ item.text }}</span>
          </button>
        </li>
      </ul>
    </footer>
  </section>
</template>

<style scoped lang="scss">
.scan-result {
  display: flex;
  flex-direction: column;
  min-height: 0;
  @include card;
  overflow: hidden;
}

.scan-result__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: spacing(3) spacing(4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.scan-result__title {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  font-size: $text-sm;
  font-weight: 700;
}

.scan-result__format {
  padding: spacing(1) spacing(2.5);
  border-radius: $radius-pill;
  background: var(--color-brand-soft);
  color: var(--color-primary);
  font-size: $text-xs;
  font-weight: 700;
}

.scan-result__body {
  flex: 1;
  min-height: 0;
  padding: spacing(5);
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.scan-result__chip {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: spacing(1.5);
  padding: spacing(1) spacing(3);
  border-radius: $radius-pill;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: $text-xs;
  font-weight: 600;
}

.scan-result__value {
  padding: spacing(4);
  border-radius: $radius-md;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  font-family: $font-mono;
  font-size: $text-sm;
  color: var(--color-text);
  word-break: break-all;
  white-space: pre-wrap;
  max-height: 40vh;
  overflow-y: auto;
  @include custom-scrollbar;
}

.scan-result__actions {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2);
}

.scan-result__open {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(2.5) spacing(4);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: $text-sm;
  font-weight: 600;
  transition: border-color $transition-fast, background-color $transition-fast, color $transition-fast;

  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
    background: var(--color-brand-soft);
  }
}

.scan-result__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: spacing(3);
  text-align: center;
  color: var(--color-text-subtle);
  font-size: $text-sm;
}

.scan-result__history {
  padding: spacing(3) spacing(4) spacing(4);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-2);

  ul {
    margin-top: spacing(2);
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: spacing(1);
  }

  button {
    @include button-reset;

    display: flex;
    align-items: center;
    gap: spacing(2);
    width: 100%;
    padding: spacing(2);
    border-radius: $radius-sm;
    text-align: left;

    &:hover {
      background: var(--color-surface-3);
    }
  }
}

.scan-result__history-title {
  font-size: $text-xs;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.scan-result__history-format {
  flex-shrink: 0;
  font-size: $text-xs;
  font-weight: 700;
  color: var(--color-primary);
}

.scan-result__history-text {
  font-family: $font-mono;
  font-size: $text-xs;
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
