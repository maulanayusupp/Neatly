<script setup lang="ts">
const toast = useToast()
const count = ref(5)
const uuids = ref<string[]>([])
const copiedAll = ref(false)

const options = [1, 5, 10, 25, 50]

function generate() {
  uuids.value = Array.from({ length: count.value }, () => crypto.randomUUID())
}

// Generate on the client only (avoids SSR/hydration mismatch on random values).
onMounted(generate)

async function copyOne(value: string) {
  if (await copyText(value)) toast.success('Copied')
}

async function copyAll() {
  if (uuids.value.length && await copyText(uuids.value.join('\n'))) {
    copiedAll.value = true
    toast.success('All copied')
    setTimeout(() => (copiedAll.value = false), 1600)
  }
}

const { t } = useI18n()

useSeoMeta({
  title: () => t('uuid.metaTitle'),
  description: () => t('uuid.metaDesc'),
  ogTitle: () => t('uuid.metaTitle'),
  ogDescription: () => t('uuid.metaDesc'),
  twitterTitle: () => t('uuid.metaTitle'),
  twitterDescription: () => t('uuid.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/uuid' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="fingerprint"
      :badge="$t('uuid.badge')"
      :title="$t('uuid.titleA')"
      :gradient="$t('uuid.titleHl')"
      :lead="$t('uuid.lead')"
    />

    <section class="container tool-outlet">
      <div class="tool-panel uuid">
        <div class="uuid__bar">
          <label class="uuid__count">
            <span>{{ $t('uuid.count') }}</span>
            <select v-model.number="count">
              <option v-for="n in options" :key="n" :value="n">{{ n }}</option>
            </select>
          </label>
          <div class="uuid__actions">
            <BaseButton icon="refresh" @click="generate">{{ $t('uuid.generate') }}</BaseButton>
            <BaseButton variant="secondary" :icon="copiedAll ? 'check' : 'copy'" :disabled="!uuids.length" @click="copyAll">
              {{ $t('uuid.copyAll') }}
            </BaseButton>
          </div>
        </div>

        <ul class="uuid__list" role="list">
          <li v-for="(u, i) in uuids" :key="i">
            <code>{{ u }}</code>
            <button type="button" aria-label="Copy" @click="copyOne(u)"><BaseIcon name="copy" :size="15" /></button>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.uuid__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: spacing(3);
  margin-bottom: spacing(4);
}

.uuid__count {
  display: flex;
  flex-direction: column;
  gap: spacing(1.5);
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);

  select {
    padding: spacing(2) spacing(3);
    border-radius: $radius-md;
    border: 1px solid var(--color-border);
    background: var(--color-surface-2);
    color: var(--color-text);
    font-size: $text-sm;
    font-weight: 600;
  }
}

.uuid__actions {
  display: flex;
  gap: spacing(2);
}

.uuid__list {
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: spacing(2);

  li {
    display: flex;
    align-items: center;
    gap: spacing(3);
    padding: spacing(2.5) spacing(3);
    border-radius: $radius-md;
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
  }

  code {
    flex: 1;
    font-family: $font-mono;
    font-size: $text-sm;
    color: var(--color-text);
    word-break: break-all;
  }

  button {
    @include button-reset;
    color: var(--color-text-muted);
    &:hover { color: var(--color-primary); }
  }
}
</style>
