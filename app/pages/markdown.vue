<script setup lang="ts">
import { highlightCode } from '~/utils/highlight'

const { t } = useI18n()
const toast = useToast()

const SAMPLE = '# Neatly\n\n**Markdown** to HTML with a *live* preview.\n\n- Fast\n- Private\n- Free\n\n> Paste Markdown, copy clean HTML.\n\n```js\nconsole.log("hello")\n```\n\n[Visit Neatly](https://neatlyapp.vercel.app)'

const input = ref('')
const tab = ref<'preview' | 'html'>('preview')
const helpOpen = ref(false)

const CHEATSHEET: { key: string, syntax: string }[] = [
  { key: 'heading', syntax: '# H1\n## H2\n### H3' },
  { key: 'bold', syntax: '**bold text**' },
  { key: 'italic', syntax: '*italic text*' },
  { key: 'strike', syntax: '~~strikethrough~~' },
  { key: 'link', syntax: '[title](https://url.com)' },
  { key: 'image', syntax: '![alt text](image.png)' },
  { key: 'ulist', syntax: '- item one\n- item two' },
  { key: 'olist', syntax: '1. first\n2. second' },
  { key: 'task', syntax: '- [ ] to do\n- [x] done' },
  { key: 'code', syntax: '`inline code`' },
  { key: 'codeblock', syntax: '```js\nconst x = 1\n```' },
  { key: 'quote', syntax: '> a quotation' },
  { key: 'table', syntax: '| A | B |\n|---|---|\n| 1 | 2 |' },
  { key: 'hr', syntax: '---' },
]

function onHelpKey(e: KeyboardEvent) {
  if (e.key === 'Escape') helpOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onHelpKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onHelpKey))
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
          <div class="md__actions">
            <BaseButton size="sm" variant="ghost" icon="help" :title="$t('mdTool.help.title')" @click="helpOpen = true">{{ $t('mdTool.help.title') }}</BaseButton>
            <BaseButton size="sm" variant="ghost" icon="sparkles" @click="input = SAMPLE">{{ $t('common.example') }}</BaseButton>
          </div>
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

    <ClientOnly>
      <Teleport to="body">
        <Transition name="mdhelp">
          <div v-if="helpOpen" class="mdhelp" @click.self="helpOpen = false">
            <div class="mdhelp__panel" role="dialog" aria-modal="true">
              <header class="mdhelp__head">
                <h2 class="mdhelp__title"><BaseIcon name="markdown" :size="18" /> {{ $t('mdTool.help.title') }}</h2>
                <button class="mdhelp__close" type="button" :aria-label="$t('mdTool.help.close')" @click="helpOpen = false">
                  <BaseIcon name="x" :size="18" />
                </button>
              </header>
              <div class="mdhelp__body">
                <div v-for="item in CHEATSHEET" :key="item.key" class="mdhelp__row">
                  <span class="mdhelp__label">{{ $t(`mdTool.help.${item.key}`) }}</span>
                  <pre class="mdhelp__code">{{ item.syntax }}</pre>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
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

.md__actions { display: inline-flex; gap: spacing(1); flex-wrap: wrap; }

/* Help modal */
.mdhelp {
  position: fixed;
  inset: 0;
  z-index: $z-toast;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 8vh spacing(4) spacing(4);
  background: rgba(11, 13, 22, 0.55);
  backdrop-filter: blur(4px);
}

.mdhelp__panel {
  width: 100%;
  max-width: 560px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  border-radius: $radius-lg;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.mdhelp__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: spacing(4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.mdhelp__title {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  font-size: $text-lg;
}

.mdhelp__close {
  @include button-reset;
  display: inline-flex;
  padding: spacing(1.5);
  border-radius: $radius-sm;
  color: var(--color-text-muted);
  &:hover { color: var(--color-text); background: var(--color-surface-3); }
}

.mdhelp__body {
  overflow-y: auto;
  padding: spacing(3);
  display: flex;
  flex-direction: column;
  gap: spacing(1);
  @include custom-scrollbar;
}

.mdhelp__row {
  display: flex;
  align-items: center;
  gap: spacing(3);
  padding: spacing(2.5) spacing(3);
  border-radius: $radius-md;

  &:hover { background: var(--color-surface-2); }
}

.mdhelp__label {
  flex-shrink: 0;
  width: 8rem;
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text);
}

.mdhelp__code {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: spacing(2) spacing(3);
  border-radius: $radius-sm;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  font-family: $font-mono;
  font-size: $text-xs;
  color: var(--syntax-key);
  white-space: pre-wrap;
  word-break: break-word;
}

.mdhelp-enter-active,
.mdhelp-leave-active { transition: opacity $transition-fast; }
.mdhelp-enter-from,
.mdhelp-leave-to { opacity: 0; }

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
