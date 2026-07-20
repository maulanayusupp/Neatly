<script setup lang="ts">
useSeoMeta({
  title: 'Disclaimer · Neatly',
  description: 'Neatly is provided for convenience with no warranty. Always review output before relying on it.',
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatly.tools/disclaimer' }] })
</script>

<template>
  <LegalArticle
    title="Disclaimer"
    intro="Please read this before relying on any output from Neatly."
    updated="20 July 2026"
  >
    <h2>Accuracy of results</h2>
    <p>
      Neatly aims to produce correct, reliable output, but results are provided
      <strong>without any guarantee of accuracy, completeness or suitability</strong>
      for a particular purpose. Always review and test transformed, converted or
      compared output before using it in production.
    </p>

    <h2>Use at your own risk</h2>
    <p>
      You use the Service at your own risk. The operator of Neatly is not liable for
      any loss or damage arising from the use of, or reliance on, its output — including
      loss of data, corrupted files or broken builds.
    </p>

    <h2>Scanning</h2>
    <p>
      QR code and barcode scanning depends on your camera, lighting and image
      quality, and may occasionally misread or fail to read a code. Always verify
      decoded content — and be cautious before opening links or acting on data from
      codes you do not trust.
    </p>

    <h2>Third-party libraries</h2>
    <p>
      Neatly relies on well-established open-source libraries (such as Terser,
      clean-css, html-minifier-terser, js-beautify, js-yaml, PapaParse,
      fast-xml-parser and @zxing/browser). Those libraries are provided under their
      own licenses and warranties, and their behaviour is outside our control.
    </p>

    <h2>Related</h2>
    <p>
      This disclaimer forms part of, and should be read together with, our
      <NuxtLink to="/terms">Terms of Service</NuxtLink> and
      <NuxtLink to="/privacy">Privacy Policy</NuxtLink>.
    </p>
  </LegalArticle>
</template>
