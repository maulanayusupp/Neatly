<script setup lang="ts">
import type { MetaConfig } from '~/utils/meta-tags'
import { DEFAULT_META, generateMetaTags, hostFromUrl } from '~/utils/meta-tags'

const { t } = useI18n()
const toast = useToast()

const cfg = reactive<MetaConfig>({ ...DEFAULT_META })
const copied = ref(false)

const tags = computed(() => generateMetaTags(cfg))
const host = computed(() => hostFromUrl(cfg.url) || 'example.com')
const pathParts = computed(() => {
  try {
    return new URL(cfg.url).pathname.split('/').filter(Boolean)
  }
  catch {
    return []
  }
})

const TYPES = ['website', 'article', 'profile', 'product', 'video.other']
const CARDS = ['summary_large_image', 'summary']
const ROBOTS = ['index, follow', 'noindex, nofollow', 'index, nofollow', 'noindex, follow']

function loadExample() {
  Object.assign(cfg, {
    title: 'Neatly — Free Online Developer Tools',
    description: 'Beautify, minify, convert and validate code — plus 25+ handy dev tools. Fast, private, and free.',
    url: 'https://withneatly.com',
    image: 'https://withneatly.com/og-image.png',
    siteName: 'Neatly',
    type: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: '@neatly',
    themeColor: '#6366f1',
    author: 'Maulana',
    keywords: 'developer tools, beautify, minify, json, converter',
    robots: 'index, follow',
    locale: 'en_US',
  })
}

async function copy() {
  if (tags.value && await copyText(tags.value)) {
    copied.value = true
    toast.success(t('common.copied'))
    setTimeout(() => (copied.value = false), 1600)
  }
}

useSeoMeta({
  title: () => t('metaTags.metaTitle'),
  description: () => t('metaTags.metaDesc'),
  ogTitle: () => t('metaTags.metaTitle'),
  ogDescription: () => t('metaTags.metaDesc'),
  twitterTitle: () => t('metaTags.metaTitle'),
  twitterDescription: () => t('metaTags.metaDesc'),
})
</script>

<template>
  <div>
    <ToolHero
      icon="globe"
      :badge="$t('metaTags.badge')"
      :title="$t('metaTags.titleA')"
      :gradient="$t('metaTags.titleHl')"
      :lead="$t('metaTags.lead')"
    />

    <section class="container tool-outlet mt">
      <div class="mt__grid">
        <!-- Form -->
        <div class="tool-panel mt__form">
          <div class="mt__bar">
            <h2 class="mt__h">{{ $t('metaTags.details') }}</h2>
            <BaseButton size="sm" variant="ghost" icon="sparkles" @click="loadExample">{{ $t('common.example') }}</BaseButton>
          </div>

          <label class="mt__field">
            <span class="mt__label">{{ $t('metaTags.fTitle') }} <em :class="{ 'is-over': cfg.title.length > 60 }">{{ cfg.title.length }}/60</em></span>
            <input v-model="cfg.title" class="mt__input" spellcheck="false">
          </label>

          <label class="mt__field">
            <span class="mt__label">{{ $t('metaTags.fDescription') }} <em :class="{ 'is-over': cfg.description.length > 160 }">{{ cfg.description.length }}/160</em></span>
            <textarea v-model="cfg.description" class="mt__input mt__textarea" spellcheck="false" />
          </label>

          <div class="mt__row">
            <label class="mt__field">
              <span class="mt__label">{{ $t('metaTags.fUrl') }}</span>
              <input v-model="cfg.url" class="mt__input" spellcheck="false" placeholder="https://example.com">
            </label>
            <label class="mt__field">
              <span class="mt__label">{{ $t('metaTags.fSiteName') }}</span>
              <input v-model="cfg.siteName" class="mt__input" spellcheck="false">
            </label>
          </div>

          <label class="mt__field">
            <span class="mt__label">{{ $t('metaTags.fImage') }}</span>
            <input v-model="cfg.image" class="mt__input" spellcheck="false" placeholder="https://example.com/og.png">
          </label>

          <div class="mt__row">
            <label class="mt__field">
              <span class="mt__label">{{ $t('metaTags.fType') }}</span>
              <select v-model="cfg.type" class="mt__input"><option v-for="o in TYPES" :key="o" :value="o">{{ o }}</option></select>
            </label>
            <label class="mt__field">
              <span class="mt__label">{{ $t('metaTags.fCard') }}</span>
              <select v-model="cfg.twitterCard" class="mt__input"><option v-for="o in CARDS" :key="o" :value="o">{{ o }}</option></select>
            </label>
          </div>

          <div class="mt__row">
            <label class="mt__field">
              <span class="mt__label">{{ $t('metaTags.fTwitterSite') }}</span>
              <input v-model="cfg.twitterSite" class="mt__input" spellcheck="false" placeholder="@handle">
            </label>
            <label class="mt__field">
              <span class="mt__label">{{ $t('metaTags.fThemeColor') }}</span>
              <input v-model="cfg.themeColor" class="mt__input" spellcheck="false" placeholder="#6366f1">
            </label>
          </div>

          <div class="mt__row">
            <label class="mt__field">
              <span class="mt__label">{{ $t('metaTags.fAuthor') }}</span>
              <input v-model="cfg.author" class="mt__input" spellcheck="false">
            </label>
            <label class="mt__field">
              <span class="mt__label">{{ $t('metaTags.fLocale') }}</span>
              <input v-model="cfg.locale" class="mt__input" spellcheck="false" placeholder="en_US">
            </label>
          </div>

          <label class="mt__field">
            <span class="mt__label">{{ $t('metaTags.fKeywords') }}</span>
            <input v-model="cfg.keywords" class="mt__input" spellcheck="false">
          </label>

          <label class="mt__field">
            <span class="mt__label">{{ $t('metaTags.fRobots') }}</span>
            <select v-model="cfg.robots" class="mt__input"><option v-for="o in ROBOTS" :key="o" :value="o">{{ o }}</option></select>
          </label>
        </div>

        <!-- Previews + output -->
        <div class="mt__right">
          <div class="tool-panel mt__preview">
            <h2 class="mt__h">{{ $t('metaTags.prevGoogle') }}</h2>
            <div class="g">
              <div class="g__url">{{ host }}<span v-for="(p, i) in pathParts" :key="i"> › {{ p }}</span></div>
              <div class="g__title">{{ cfg.title || $t('metaTags.samplePageTitle') }}</div>
              <div class="g__desc">{{ cfg.description || $t('metaTags.sampleDesc') }}</div>
            </div>
          </div>

          <div class="tool-panel mt__preview">
            <h2 class="mt__h">{{ $t('metaTags.prevSocial') }}</h2>
            <div class="card">
              <div class="card__img">
                <img v-if="cfg.image" :src="cfg.image" alt=""><span v-else class="card__ph"><BaseIcon name="image" :size="28" /></span>
              </div>
              <div class="card__body">
                <div class="card__host">{{ host.toUpperCase() }}</div>
                <div class="card__title">{{ cfg.title || $t('metaTags.samplePageTitle') }}</div>
                <div class="card__desc">{{ cfg.description || $t('metaTags.sampleDesc') }}</div>
              </div>
            </div>
          </div>

          <div class="tool-panel mt__preview">
            <h2 class="mt__h">{{ $t('metaTags.prevTwitter') }}</h2>
            <div class="tw" :class="cfg.twitterCard === 'summary' ? 'tw--small' : 'tw--large'">
              <div class="tw__img">
                <img v-if="cfg.image" :src="cfg.image" alt=""><span v-else class="card__ph"><BaseIcon name="image" :size="24" /></span>
              </div>
              <div class="tw__body">
                <div class="tw__title">{{ cfg.title || $t('metaTags.samplePageTitle') }}</div>
                <div class="tw__desc">{{ cfg.description || $t('metaTags.sampleDesc') }}</div>
                <div class="tw__host">{{ host }}</div>
              </div>
            </div>
          </div>

          <div class="tool-panel mt__code">
            <div class="mt__bar">
              <h2 class="mt__h">{{ $t('metaTags.output') }}</h2>
              <BaseButton size="sm" variant="ghost" :icon="copied ? 'check' : 'copy'" @click="copy">{{ copied ? $t('common.copied') : $t('common.copy') }}</BaseButton>
            </div>
            <pre class="mt__pre"><code>{{ tags }}</code></pre>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.mt__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('lg') { grid-template-columns: 1fr 1fr; align-items: start; }
}

.mt__form, .mt__right { display: flex; flex-direction: column; gap: spacing(4); }

.mt__bar { display: flex; align-items: center; justify-content: space-between; gap: spacing(3); }

.mt__h {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.mt__field { display: flex; flex-direction: column; gap: spacing(2); }

.mt__row {
  display: grid;
  grid-template-columns: 1fr;
  gap: spacing(3);

  @include respond('sm') { grid-template-columns: 1fr 1fr; }
}

.mt__label {
  display: flex;
  justify-content: space-between;
  font-size: $text-xs;
  font-weight: 600;
  color: var(--color-text-muted);

  em { font-style: normal; color: var(--color-text-subtle); font-variant-numeric: tabular-nums; }
  em.is-over { color: var(--color-danger); }
}

.mt__input {
  padding: spacing(2.5) spacing(3);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-size: $text-sm;

  &:focus { outline: none; border-color: var(--color-primary); }
}

.mt__textarea { min-height: 72px; resize: vertical; font-family: inherit; }

/* Google preview */
.g { display: flex; flex-direction: column; gap: spacing(1); margin-top: spacing(2); }
.g__url { font-size: $text-xs; color: var(--color-text-muted); }
.g__title { color: #1a0dab; font-size: $text-lg; }
.g__desc { font-size: $text-sm; color: var(--color-text-muted); }

:root[data-theme='dark'] .g__title { color: #8ab4f8; }
@media (prefers-color-scheme: dark) { .g__title { color: #8ab4f8; } }

/* Social (Facebook/LinkedIn) card */
.card {
  margin-top: spacing(2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  overflow: hidden;
}
.card__img, .tw__img {
  aspect-ratio: 1.91 / 1;
  background: var(--color-surface-2);
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
}
.card__ph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--color-text-subtle);
}
.card__body { padding: spacing(3); background: var(--color-surface-2); display: flex; flex-direction: column; gap: spacing(1); }
.card__host { font-size: $text-xs; text-transform: uppercase; color: var(--color-text-subtle); letter-spacing: 0.03em; }
.card__title { font-weight: 700; font-size: $text-sm; color: var(--color-text); }
.card__desc { font-size: $text-xs; color: var(--color-text-muted); }

/* Twitter card */
.tw {
  margin-top: spacing(2);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  overflow: hidden;
}
.tw--large { display: flex; flex-direction: column; }
.tw--small { display: grid; grid-template-columns: 128px 1fr; }
.tw--small .tw__img { aspect-ratio: 1 / 1; }
.tw__body { padding: spacing(3); display: flex; flex-direction: column; gap: spacing(1); }
.tw__title { font-weight: 700; font-size: $text-sm; color: var(--color-text); }
.tw__desc { font-size: $text-xs; color: var(--color-text-muted); }
.tw__host { font-size: $text-xs; color: var(--color-text-subtle); }

.mt__pre {
  margin: spacing(2) 0 0;
  padding: spacing(3);
  border-radius: $radius-md;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  overflow: auto;
  max-height: 340px;
  font-family: $font-mono;
  font-size: $text-xs;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  @include custom-scrollbar;
}
</style>
