<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('qrGen.metaTitle'),
  description: () => t('qrGen.metaDesc'),
  ogTitle: () => t('qrGen.metaTitle'),
  ogDescription: () => t('qrGen.metaDesc'),
  twitterTitle: () => t('qrGen.metaTitle'),
  twitterDescription: () => t('qrGen.metaDesc'),
})
</script>

<template>
  <div class="qrgen-page">
    <section class="hero">
      <div class="container hero__inner">
        <span class="hero__badge">
          <BaseIcon name="qr" :size="15" />
          {{ $t('qrGen.badge') }}
        </span>
        <h1 class="hero__title">
          {{ $t('qrGen.titleA') }} <span class="text-gradient">{{ $t('qrGen.titleHl') }}</span> {{ $t('qrGen.titleB') }}
        </h1>
        <p class="hero__lead">{{ $t('qrGen.lead') }}</p>
      </div>
    </section>

    <section class="container qrgen-page__studio">
      <ClientOnly>
        <QrGenerator />
        <template #fallback>
          <div class="qrgen-page__loading">Loading generator…</div>
        </template>
      </ClientOnly>
    </section>

    <section class="container qrgen-page__about">
      <h2>{{ $t('qrGen.aboutHeading') }}</h2>
      <p>{{ $t('qrGen.aboutP1') }}</p>
      <p>{{ $t('qrGen.aboutP2') }}</p>
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

.qrgen-page__loading {
  padding: spacing(16) spacing(6);
  text-align: center;
  color: var(--color-text-subtle);
  @include card;
}

.qrgen-page__about {
  padding-block: spacing(12) spacing(16);
  max-width: 760px;

  h2 { font-size: $text-2xl; }
  p {
    margin-top: spacing(4);
    color: var(--color-text-muted);
    line-height: 1.7;
  }
}
</style>
