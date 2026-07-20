<script setup lang="ts">
import type { ShareState } from '~/composables/useTransform'

const { public: { siteUrl, siteName } } = useRuntimeConfig()

const store = useTransform()

// Restore editor state from a shared link (#s=…) on first load.
onMounted(async () => {
  const shared = await readShareUrl<ShareState>()
  if (shared) store.applyShareState(shared)
})

const pageTitle = 'Neatly — Beautify, Minify & Unminify JavaScript, CSS, HTML, JSON & XML'
const pageDescription
  = 'Free online code beautifier, minifier and unminifier. Instantly format, prettify or compress JavaScript, TypeScript, CSS, HTML, JSON, YAML and XML — paste, drop a file, done. Private, no sign-up.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})

// Structured data for rich search results.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': siteName,
        'url': siteUrl,
        'applicationCategory': 'DeveloperApplication',
        'operatingSystem': 'Any',
        'description':
          'Beautify and minify JavaScript, CSS, HTML, JSON and XML online.',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      }),
    },
  ],
})
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="container hero__inner">
        <span class="hero__badge">
          <BaseIcon name="sparkles" :size="15" />
          {{ $t('home.badge') }}
        </span>
        <h1 class="hero__title">
          {{ $t('home.titleA') }}
          <span class="text-gradient">{{ $t('home.titleHl') }}</span> {{ $t('home.titleB') }}
        </h1>
        <p class="hero__lead">{{ $t('home.lead') }}</p>
      </div>
    </section>

    <section class="studio-section">
      <div class="container">
        <TransformStudio />
      </div>
    </section>

    <FeatureSection />
    <PopularTools />
  </div>
</template>

<style scoped lang="scss">
.hero {
  padding-block: spacing(14) spacing(8);
  text-align: center;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(1.5) spacing(3.5);
  border-radius: $radius-pill;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: $text-xs;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.hero__title {
  margin-top: spacing(5);
  font-size: $text-4xl;
  letter-spacing: -0.035em;

  @include respond('md') {
    font-size: 3.5rem;
  }
}

.hero__lead {
  margin: spacing(5) auto 0;
  max-width: 62ch;
  color: var(--color-text-muted);
  font-size: $text-lg;
  line-height: 1.6;
}

.studio-section {
  padding-bottom: spacing(6);
}
</style>
