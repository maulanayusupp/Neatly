<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('scan.metaTitle'),
  description: () => t('scan.metaDesc'),
  ogTitle: () => t('scan.metaTitle'),
  ogDescription: () => t('scan.metaDesc'),
  twitterTitle: () => t('scan.metaTitle'),
  twitterDescription: () => t('scan.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/scan' }] })
</script>

<template>
  <div class="scan-page">
    <section class="hero">
      <div class="container hero__inner">
        <span class="hero__badge">
          <BaseIcon name="qr" :size="15" />
          {{ $t('scan.badge') }}
        </span>
        <h1 class="hero__title">
          {{ $t('scan.titleA') }} <span class="text-gradient">{{ $t('scan.titleHl') }}</span> {{ $t('scan.titleB') }}
        </h1>
        <p class="hero__lead">{{ $t('scan.lead') }}</p>
      </div>
    </section>

    <section class="container scan-page__studio">
      <ClientOnly>
        <div class="scan-page__grid">
          <QrScanner />
          <ScanResult />
        </div>
        <template #fallback>
          <div class="scan-page__loading">Loading scanner…</div>
        </template>
      </ClientOnly>
    </section>

    <section class="container scan-page__about">
      <h2>{{ $t('scan.aboutHeading') }}</h2>
      <p>{{ $t('scan.aboutP1') }}</p>
      <p>{{ $t('scan.aboutP2') }}</p>
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
  max-width: 58ch;
  color: var(--color-text-muted);
  font-size: $text-lg;
}

.scan-page__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('lg') {
    grid-template-columns: 1fr 1fr;
    // Both columns stretch to the same height for a consistent layout.
    align-items: stretch;
  }
}

.scan-page__loading {
  padding: spacing(16) spacing(6);
  text-align: center;
  color: var(--color-text-subtle);
  @include card;
}

.scan-page__about {
  padding-block: spacing(12) spacing(16);
  max-width: 760px;

  h2 {
    font-size: $text-2xl;
  }
  p {
    margin-top: spacing(4);
    color: var(--color-text-muted);
    line-height: 1.7;
  }
}
</style>
