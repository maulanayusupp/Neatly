<script setup lang="ts">
const pageTitle = 'URL Encode & Decode — Free Online URL Encoder/Decoder · Neatly'
const pageDescription
  = 'Free online URL encoder and decoder. Percent-encode text for URLs or decode it back, instantly and privately in your browser. No sign-up.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/url-encode' }] })

function convert(text: string, mode: 'forward' | 'backward') {
  return mode === 'forward' ? encodeURIComponent(text) : decodeURIComponent(text)
}
</script>

<template>
  <div>
    <ToolHero
      icon="link"
      badge="Percent-encode · Decode"
      title="URL"
      gradient="encoder & decoder"
      lead="Percent-encode text so it's safe inside a URL, or decode an encoded string back to plain text."
    />
    <section class="container tool-outlet">
      <div class="tool-panel">
        <SimpleConverter
          forward-label="Encode"
          backward-label="Decode"
          placeholder="Type or paste text to encode…"
          :convert="convert"
        />
      </div>
    </section>
  </div>
</template>
