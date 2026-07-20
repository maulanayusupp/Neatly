<script setup lang="ts">
import { generateLorem } from '~/utils/lorem'

const { t } = useI18n()
const toast = useToast()

const paragraphs = ref(4)
const wordsPerPara = ref(45)
const startWithLorem = ref(true)
const wrapHtml = ref(false)
const items = ref<string[]>([])
const copiedIndex = ref(-1)
const copiedAll = ref(false)

function regenerate() {
  items.value = generateLorem({
    paragraphs: paragraphs.value,
    wordsPerPara: wordsPerPara.value,
    startWithLorem: startWithLorem.value,
  })
}

// Client-only (Math.random) to avoid SSR/hydration mismatch.
onMounted(regenerate)
watch([paragraphs, wordsPerPara, startWithLorem], regenerate)

function format(p: string): string {
  return wrapHtml.value ? `<p>${p}</p>` : p
}
const fullText = computed(() => items.value.map(format).join(wrapHtml.value ? '\n' : '\n\n'))
const wordCount = computed(() => items.value.join(' ').split(/\s+/).filter(Boolean).length)
const charCount = computed(() => fullText.value.length)

async function copyOne(i: number) {
  if (await copyText(format(items.value[i]!))) {
    copiedIndex.value = i
    toast.success(t('common.copied'))
    setTimeout(() => (copiedIndex.value = -1), 1400)
  }
}
async function copyAll() {
  if (await copyText(fullText.value)) {
    copiedAll.value = true
    toast.success(t('common.copied'))
    setTimeout(() => (copiedAll.value = false), 1600)
  }
}
function download() {
  downloadText('lorem-ipsum.txt', fullText.value, 'text/plain')
  toast.success(t('lorem.download'))
}

useSeoMeta({
  title: () => t('lorem.metaTitle'),
  description: () => t('lorem.metaDesc'),
  ogTitle: () => t('lorem.metaTitle'),
  ogDescription: () => t('lorem.metaDesc'),
  twitterTitle: () => t('lorem.metaTitle'),
  twitterDescription: () => t('lorem.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/lorem' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="code"
      :badge="$t('lorem.badge')"
      :title="$t('lorem.titleA')"
      :gradient="$t('lorem.titleHl')"
      :lead="$t('lorem.lead')"
    />

    <section class="container tool-outlet lorem">
      <div class="tool-panel lorem__controls">
        <label class="lorem__slider">
          <span>{{ $t('lorem.paragraphs') }}: <strong>{{ paragraphs }}</strong></span>
          <input v-model.number="paragraphs" type="range" min="1" max="20">
        </label>
        <label class="lorem__slider">
          <span>{{ $t('lorem.wordsPerPara') }}: <strong>{{ wordsPerPara }}</strong></span>
          <input v-model.number="wordsPerPara" type="range" min="20" max="120" step="5">
        </label>
        <div class="lorem__toggles">
          <label class="lorem__toggle"><input v-model="startWithLorem" type="checkbox"><span>{{ $t('lorem.startWith') }}</span></label>
          <label class="lorem__toggle"><input v-model="wrapHtml" type="checkbox"><span>{{ $t('lorem.wrapHtml') }}</span></label>
        </div>
      </div>

      <div class="lorem__bar">
        <span class="lorem__stats">{{ formatNumber(wordCount) }} {{ $t('lorem.words') }} · {{ formatNumber(charCount) }} {{ $t('lorem.chars') }}</span>
        <div class="lorem__bar-actions">
          <BaseButton size="sm" variant="ghost" icon="refresh" @click="regenerate">{{ $t('lorem.regenerate') }}</BaseButton>
          <BaseButton size="sm" variant="ghost" icon="download" @click="download">{{ $t('lorem.download') }}</BaseButton>
          <BaseButton size="sm" variant="primary" :icon="copiedAll ? 'check' : 'copy'" @click="copyAll">{{ $t('lorem.copyAll') }}</BaseButton>
        </div>
      </div>

      <div class="lorem__paras">
        <article v-for="(p, i) in items" :key="i" class="lorem__para">
          <p>{{ wrapHtml ? `<p>${p}</p>` : p }}</p>
          <button type="button" class="lorem__para-copy" :aria-label="$t('lorem.copyParagraph')" @click="copyOne(i)">
            <BaseIcon :name="copiedIndex === i ? 'check' : 'copy'" :size="15" />
          </button>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.lorem {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.lorem__controls {
  display: grid;
  gap: spacing(5);
  grid-template-columns: 1fr;

  @include respond('md') { grid-template-columns: 1fr 1fr; }
}

.lorem__slider {
  display: flex;
  flex-direction: column;
  gap: spacing(2);
  font-size: $text-sm;
  color: var(--color-text-muted);

  strong { color: var(--color-text); }
  input { width: 100%; accent-color: var(--color-primary); }
}

.lorem__toggles {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(4);

  @include respond('md') { grid-column: 1 / -1; }
}

.lorem__toggle {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  font-size: $text-sm;
  color: var(--color-text);
  cursor: pointer;
  input { width: 18px; height: 18px; accent-color: var(--color-primary); }
}

.lorem__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: spacing(3);
  padding: spacing(3) spacing(4);
  @include card;
}

.lorem__stats {
  font-size: $text-sm;
  color: var(--color-text-subtle);
  font-variant-numeric: tabular-nums;
}

.lorem__bar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2);
}

.lorem__paras {
  display: flex;
  flex-direction: column;
  gap: spacing(3);
}

.lorem__para {
  position: relative;
  padding: spacing(5);
  padding-right: spacing(12);
  @include card;
  transition: border-color $transition-fast;

  &:hover {
    border-color: var(--color-border-strong);
    .lorem__para-copy { opacity: 1; }
  }

  p {
    color: var(--color-text-muted);
    line-height: 1.75;
  }
}

.lorem__para-copy {
  @include button-reset;
  position: absolute;
  top: spacing(3);
  right: spacing(3);
  padding: spacing(2);
  border-radius: $radius-sm;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  opacity: 0;
  transition: opacity $transition-fast, color $transition-fast;

  &:hover { color: var(--color-primary); }

  @media (hover: none) { opacity: 1; }
}
</style>
