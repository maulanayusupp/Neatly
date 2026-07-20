<script setup lang="ts">
const { public: { siteUrl, siteName } } = useRuntimeConfig()

useSeoMeta({
  title: 'Neatly — Beautify & Minify Code Instantly',
  description:
    'Free online tool to beautify (unminify) and minify JavaScript, CSS, HTML, JSON and XML. Paste your code, pick a mode, and get clean or compact output in a click.',
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
          Beautify &amp; minify · 5 languages
        </span>
        <h1 class="hero__title">
          Make your code
          <span class="text-gradient">neat</span>, instantly.
        </h1>
        <p class="hero__lead">
          Paste minified code to unpack and prettify it, or compress your source to ship less.
          Works with JavaScript, CSS, HTML, JSON and XML — right in your browser.
        </p>
      </div>
    </section>

    <section class="studio-section">
      <div class="container">
        <TransformStudio />
      </div>
    </section>

    <FeatureSection />
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
