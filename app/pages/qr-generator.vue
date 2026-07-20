<script setup lang="ts">
const pageTitle = 'QR Code Generator — Create QR Codes & Barcodes Online Free · Neatly'
const pageDescription
  = 'Free online QR code generator. Create QR codes for URLs, text, Wi-Fi, email, phone and vCard — customise colors and size, and download as PNG or SVG. Barcodes too. Private, no sign-up.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/qr-generator' }] })
</script>

<template>
  <div class="qrgen-page">
    <section class="hero">
      <div class="container hero__inner">
        <span class="hero__badge">
          <BaseIcon name="qr" :size="15" />
          QR codes · Wi-Fi · vCard · barcodes
        </span>
        <h1 class="hero__title">
          Generate <span class="text-gradient">QR codes</span> &amp; barcodes
        </h1>
        <p class="hero__lead">
          Create QR codes for links, text, Wi-Fi, email, phone numbers and contact
          cards — pick your colors and size, then download as PNG or SVG. Everything
          runs privately in your browser.
        </p>
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
      <h2>Free QR code &amp; barcode generator</h2>
      <p>
        Neatly's generator creates high-quality QR codes for URLs, plain text,
        Wi-Fi networks, email, phone numbers and vCard contacts, plus common
        barcode formats (CODE128, EAN, UPC, CODE39 and more). Customise the
        foreground and background colors, size and error-correction level, then
        export a crisp PNG or an infinitely scalable SVG.
      </p>
      <p>
        Everything is generated on your device — nothing is uploaded — so it's
        fast, private and free, with no watermark and no sign-up.
      </p>
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
