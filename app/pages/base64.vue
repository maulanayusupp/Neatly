<script setup lang="ts">
import { base64Decode, base64Encode } from '~/utils/encoding'

const { t } = useI18n()

useSeoMeta({
  title: () => t('base64.metaTitle'),
  description: () => t('base64.metaDesc'),
  ogTitle: () => t('base64.metaTitle'),
  ogDescription: () => t('base64.metaDesc'),
  twitterTitle: () => t('base64.metaTitle'),
  twitterDescription: () => t('base64.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/base64' }] })

function convert(text: string, mode: 'forward' | 'backward') {
  return mode === 'forward' ? base64Encode(text) : base64Decode(text)
}

const examples: { label: string, mode: 'forward' | 'backward', value: string }[] = [
  { label: 'Text → Base64', mode: 'forward', value: 'Hello, Neatly! 👋' },
  { label: 'Basic Auth', mode: 'forward', value: 'aladdin:opensesame' },
  { label: 'JSON payload', mode: 'forward', value: '{"userId":42,"role":"admin"}' },
  { label: 'Decode → text', mode: 'backward', value: 'TmVhdGx5IG1ha2VzIHlvdXIgY29kZSBuZWF0ISDwn5qAIERlY29kZSBtZSBiYWNrIHRvIHRleHQu' },
  { label: 'Decode Basic Auth', mode: 'backward', value: 'YWxhZGRpbjpvcGVuc2VzYW1l' },
]
</script>

<template>
  <div>
    <ToolHero
      icon="code"
      :badge="$t('base64.badge')"
      :title="$t('base64.titleA')"
      :gradient="$t('base64.titleHl')"
      :lead="$t('base64.lead')"
    />
    <section class="container tool-outlet">
      <div class="tool-panel">
        <SimpleConverter
          :forward-label="$t('base64.encode')"
          :backward-label="$t('base64.decode')"
          :placeholder="$t('base64.placeholder')"
          :examples="examples"
          :convert="convert"
        />
      </div>
    </section>
  </div>
</template>
