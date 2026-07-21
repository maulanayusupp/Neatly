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

function convert(text: string, mode: 'forward' | 'backward') {
  return mode === 'forward' ? encodeURIComponent(text) : decodeURIComponent(text)
}

const examples: { label: string, mode: 'forward' | 'backward', value: string }[] = [
  { label: 'Search URL', mode: 'forward', value: 'https://neatlyapp.vercel.app/search?q=hello world&lang=id' },
  { label: 'Form data', mode: 'forward', value: 'name=John Doe&email=john@example.com&note=100% sure!' },
  { label: 'Path with spaces', mode: 'forward', value: '/files/my report final.pdf' },
  { label: 'Decode URL', mode: 'backward', value: 'https%3A%2F%2Fneatlyapp.vercel.app%2Fsearch%3Fq%3Dhello%20world%26lang%3Did' },
  { label: 'Decode form data', mode: 'backward', value: 'name%3DJohn%20Doe%26email%3Djohn%40example.com' },
]
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
          :examples="examples"
          :convert="convert"
        />
      </div>
    </section>
  </div>
</template>
