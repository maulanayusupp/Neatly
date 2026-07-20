<script setup lang="ts">
import { base64Decode, base64Encode } from '~/utils/encoding'

const pageTitle = 'Base64 Encode & Decode — Free Online Base64 Converter · Neatly'
const pageDescription
  = 'Free online Base64 encoder and decoder. Convert text to Base64 and back, UTF-8 safe, instantly and privately in your browser. No sign-up.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/base64' }] })

function convert(text: string, mode: 'forward' | 'backward') {
  return mode === 'forward' ? base64Encode(text) : base64Decode(text)
}
</script>

<template>
  <div>
    <ToolHero
      icon="code"
      badge="Encode · Decode · UTF-8 safe"
      title="Base64"
      gradient="encoder & decoder"
      lead="Convert text to Base64 and back. Handles Unicode correctly and runs entirely in your browser."
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
