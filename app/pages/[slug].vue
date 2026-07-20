<script setup lang="ts">
import { LANDING_PAGES, getLandingPage } from '#shared/utils/landing'

const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const page = getLandingPage(String(route.params.slug))
if (!page) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

// Preset the shared tool state for this landing page.
const store = useTransform()
store.setMode(page.mode)
store.selectLanguage(page.language)

// Related tools: opposite mode for this language + same mode for others.
const related = LANDING_PAGES.filter(
  candidate =>
    candidate.slug !== page.slug
    && (candidate.language === page.language || candidate.mode === page.mode),
).slice(0, 8)

useSeoMeta({
  title: page.title,
  description: page.description,
  ogTitle: page.title,
  ogDescription: page.description,
  twitterTitle: page.title,
  twitterDescription: page.description,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/${page.slug}` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': page.faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': faq.a },
        })),
      }),
    },
  ],
})
</script>

<template>
  <div class="landing">
    <section class="hero">
      <div class="container hero__inner">
        <span class="hero__badge">
          <BaseIcon :name="page.mode" :size="15" />
          {{ page.mode === 'minify' ? 'Minifier' : 'Beautifier' }} · {{ page.label }}
        </span>
        <h1 class="hero__title">
          {{ page.mode === 'minify' ? 'Minify' : 'Beautify' }}
          <span class="text-gradient">{{ page.label }}</span>
        </h1>
        <p class="hero__lead">{{ page.intro }}</p>
      </div>
    </section>

    <section class="studio-section">
      <div class="container">
        <TransformStudio />
      </div>
    </section>

    <section class="faq">
      <div class="container faq__inner">
        <h2 class="faq__heading">Frequently asked questions</h2>
        <div class="faq__list">
          <details v-for="faq in page.faqs" :key="faq.q" class="faq__item">
            <summary class="faq__q">{{ faq.q }}</summary>
            <p class="faq__a">{{ faq.a }}</p>
          </details>
        </div>

        <nav class="faq__related" aria-label="Related tools">
          <h3 class="faq__related-title">Related tools</h3>
          <ul class="faq__links" role="list">
            <li v-for="item in related" :key="item.slug">
              <NuxtLink :to="`/${item.slug}`">
                {{ item.mode === 'minify' ? 'Minify' : 'Beautify' }} {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.hero {
  padding-block: spacing(12) spacing(6);
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
}

.hero__lead {
  margin: spacing(4) auto 0;
  max-width: 60ch;
  color: var(--color-text-muted);
  font-size: $text-lg;
}

.studio-section {
  padding-bottom: spacing(6);
}

.faq {
  padding-block: spacing(10) spacing(16);
}

.faq__heading {
  font-size: $text-2xl;
  text-align: center;
}

.faq__list {
  margin: spacing(8) auto 0;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: spacing(3);
}

.faq__item {
  @include card;
  padding: spacing(4) spacing(5);
}

.faq__q {
  font-weight: 700;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &::after {
    content: '+';
    color: var(--color-text-subtle);
    font-weight: 400;
    font-size: $text-xl;
  }
}

.faq__item[open] .faq__q::after {
  content: '−';
}

.faq__a {
  margin-top: spacing(3);
  color: var(--color-text-muted);
  font-size: $text-sm;
  line-height: 1.6;
}

.faq__related {
  margin: spacing(10) auto 0;
  max-width: 760px;
  text-align: center;
}

.faq__related-title {
  font-size: $text-lg;
}

.faq__links {
  margin-top: spacing(4);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: spacing(2);

  a {
    display: inline-block;
    padding: spacing(2) spacing(3.5);
    border-radius: $radius-pill;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-muted);
    font-size: $text-sm;
    font-weight: 600;
    transition: color $transition-fast, border-color $transition-fast, background-color $transition-fast;

    &:hover {
      color: var(--color-primary);
      border-color: var(--color-primary);
      background: var(--color-brand-soft);
    }
  }
}
</style>
