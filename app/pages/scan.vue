<script setup lang="ts">
useSeoMeta({
  title: 'QR Code & Barcode Scanner — Read Codes Online · Neatly',
  description:
    'Free online QR code and barcode scanner. Scan with your camera, upload an image, or paste a screenshot to read and extract the text instantly. Runs privately in your browser.',
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatly.tools/scan' }] })
</script>

<template>
  <div class="scan-page">
    <section class="hero">
      <div class="container hero__inner">
        <span class="hero__badge">
          <BaseIcon name="qr" :size="15" />
          QR &amp; barcode · camera · image · paste
        </span>
        <h1 class="hero__title">
          Scan any <span class="text-gradient">QR code</span> or barcode
        </h1>
        <p class="hero__lead">
          Read and extract text from QR codes and barcodes using your camera,
          an uploaded image, or a pasted screenshot — everything runs privately
          in your browser.
        </p>
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
      <h2>QR code &amp; barcode scanner, online</h2>
      <p>
        Neatly's scanner reads QR codes and common barcode formats (EAN, UPC,
        Code 128, Code 39, ITF and more) right in your browser. Point your
        camera at a code, upload a photo, or paste a screenshot — the decoded
        text appears instantly, and links, emails and phone numbers become
        one-tap actions.
      </p>
      <p>
        Because scanning happens entirely on your device, the images and camera
        frames are never uploaded or stored. It works great for reading links on
        posters, product barcodes, Wi-Fi codes and contact cards.
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

.scan-page__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('lg') {
    grid-template-columns: 1fr 1fr;
    align-items: start;
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
