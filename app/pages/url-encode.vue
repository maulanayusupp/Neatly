<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('urlEncode.metaTitle'),
  description: () => t('urlEncode.metaDesc'),
  ogTitle: () => t('urlEncode.metaTitle'),
  ogDescription: () => t('urlEncode.metaDesc'),
  twitterTitle: () => t('urlEncode.metaTitle'),
  twitterDescription: () => t('urlEncode.metaDesc'),
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
      :badge="$t('urlEncode.badge')"
      :title="$t('urlEncode.titleA')"
      :gradient="$t('urlEncode.titleHl')"
      :lead="$t('urlEncode.lead')"
    />
    <section class="container tool-outlet">
      <div class="tool-panel">
        <SimpleConverter
          :forward-label="$t('urlEncode.encode')"
          :backward-label="$t('urlEncode.decode')"
          :placeholder="$t('urlEncode.placeholder')"
          example="https://neatlyapp.vercel.app/search?q=hello world&lang=id"
          :convert="convert"
        />
      </div>
    </section>
  </div>
</template>
