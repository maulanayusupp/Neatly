<script setup lang="ts">
import { highlightCode } from '~/utils/highlight'

const { t } = useI18n()
const toast = useToast()

const SAMPLE = '# Neatly\n\n**Markdown** to HTML with a *live* preview.\n\n- Fast\n- Private\n- Free\n\n> Paste Markdown, copy clean HTML.\n\n```js\nconsole.log("hello")\n```\n\n[Visit Neatly](https://neatlyapp.vercel.app)'

const input = ref('')
const tab = ref<'preview' | 'html'>('preview')
const htmlSource = ref('')
const safeHtml = ref('')
const copied = ref(false)

async function regenerate() {
  if (!input.value.trim()) {
    htmlSource.value = ''
    safeHtml.value = ''
    return
  }
  const { marked } = await import('marked')
  const DOMPurify = (await import('dompurify')).default
  const raw = marked.parse(input.value, { breaks: true, gfm: true }) as string
  htmlSource.value = raw
  safeHtml.value = DOMPurify.sanitize(raw)
}

onMounted(() => { input.value = SAMPLE })
watch(input, regenerate)

const highlightedSource = computed(() => highlightCode(htmlSource.value, 'html'))

async function copy() {
  if (htmlSource.value && await copyText(htmlSource.value)) {
    copied.value = true
    toast.success(t('common.copied'))
    setTimeout(() => (copied.value = false), 1600)
  }
}
function download() {
  if (htmlSource.value) {
    downloadText('markdown.html', htmlSource.value, 'text/html')
    toast.success(t('common.download'))
  }
}

useSeoMeta({
  title: () => t('mdTool.metaTitle'),
  description: () => t('mdTool.metaDesc'),
  ogTitle: () => t('mdTool.metaTitle'),
  ogDescription: () => t('mdTool.metaDesc'),
  twitterTitle: () => t('mdTool.metaTitle'),
  twitterDescription: () => t('mdTool.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/markdown' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="markdown"
      :badge="$t('mdTool.badge')"
      :title="$t('mdTool.titleA')"
      :gradient="$t('mdTool.titleHl')"
      :lead="$t('mdTool.lead')"
    />

    <section class="container tool-outlet md">
      <section class="md__pane">
        <header class="md__head">
          <h2 class="md__title"><BaseIcon name="markdown" :size="16" /> {{ $t('mdTool.inputLabel') }}</h2>
          <BaseButton size="sm" variant="ghost" icon="sparkles" @click="input = SAMPLE">{{ $t('common.example') }}</BaseButton>
        </header>
        <textarea v-model="input" class="md__input" :placeholder="$t('mdTool.placeholder')" spellcheck="false" />
      </section>

      <section class="md__pane">
        <header class="md__head">
          <div class="md__tabs">
            <button type="button" :class="{ 'is-active': tab === 'preview' }" @click="tab = 'preview'">{{ $t('mdTool.preview') }}</button>
            <button type="button" :class="{ 'is-active': tab === 'html' }" @click="tab = 'html'">{{ $t('mdTool.html') }}</button>
          </div>
          <div class="md__actions">
            <BaseButton size="sm" variant="ghost" :icon="copied ? 'check' : 'copy'" :disabled="!htmlSource" @click="copy">{{ copied ? $t('common.copied') : $t('common.copy') }}</BaseButton>
            <BaseButton size="sm" variant="ghost" icon="download" :disabled="!htmlSource" @click="download">{{ $t('common.download') }}</BaseButton>
          </div>
        </header>
        <div class="md__body">
          <div v-if="!htmlSource" class="md__empty">{{ $t('mdTool.empty') }}</div>
          <div v-else-if="tab === 'preview'" class="md__preview" v-html="safeHtml" />
          <pre v-else class="md__source"><code class="hljs" v-html="highlightedSource" /></pre>
        </div>
      </section>
    </section>
  </div>
</template>

<style scoped lang="scss">
.md {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('lg') { grid-template-columns: 1fr 1fr; }
}

.md__pane {
  display: flex;
  flex-direction: column;
  height: 64vh;
  min-height: 400px;
  @include card;
  overflow: hidden;
}

.md__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: spacing(2);
  padding: spacing(2.5) spacing(4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.md__title {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  font-size: $text-sm;
  font-weight: 700;
}

.md__tabs {
  display: inline-flex;
  gap: spacing(1);

  button {
    @include button-reset;
    padding: spacing(1.5) spacing(3);
    border-radius: $radius-sm;
    font-size: $text-sm;
    font-weight: 600;
    color: var(--color-text-muted);

    &.is-active { color: var(--color-primary); background: var(--color-brand-soft); }
  }
}

.md__actions { display: inline-flex; gap: spacing(1); }

.md__input {
  flex: 1;
  border: 0;
  padding: spacing(4);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-sm;
  line-height: 1.6;
  resize: none;
  @include custom-scrollbar;
  &:focus { outline: none; }
}

.md__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  @include custom-scrollbar;
}

.md__empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-subtle);
  font-size: $text-sm;
}

.md__source {
  margin: 0;
  padding: spacing(4);
  font-family: $font-mono;
  font-size: $text-sm;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.md__preview {
  padding: spacing(5);
  color: var(--color-text);
  line-height: 1.7;

  :deep(h1), :deep(h2), :deep(h3) { margin: spacing(5) 0 spacing(3); line-height: 1.25; }
  :deep(h1) { font-size: $text-2xl; }
  :deep(h2) { font-size: $text-xl; }
  :deep(h3) { font-size: $text-lg; }
  :deep(p) { margin: spacing(3) 0; color: var(--color-text-muted); }
  :deep(ul), :deep(ol) { margin: spacing(3) 0; padding-left: spacing(6); color: var(--color-text-muted); }
  :deep(li) { margin: spacing(1) 0; }
  :deep(a) { color: var(--color-primary); }
  :deep(code) { font-family: $font-mono; font-size: 0.9em; background: var(--color-surface-2); padding: 1px 5px; border-radius: $radius-xs; }
  :deep(pre) { padding: spacing(4); border-radius: $radius-md; background: var(--color-surface-2); overflow-x: auto; }
  :deep(pre code) { background: none; padding: 0; }
  :deep(blockquote) { margin: spacing(3) 0; padding-left: spacing(4); border-left: 3px solid var(--color-border-strong); color: var(--color-text-subtle); }
  :deep(table) { border-collapse: collapse; width: 100%; }
  :deep(th), :deep(td) { border: 1px solid var(--color-border); padding: spacing(2) spacing(3); }
  :deep(img) { max-width: 100%; border-radius: $radius-sm; }
  :deep(hr) { border: 0; border-top: 1px solid var(--color-border); margin: spacing(5) 0; }
}
</style>
