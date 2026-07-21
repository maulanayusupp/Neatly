<script setup lang="ts">
import { FAQS } from '~/utils/faqs'

const route = useRoute()
const items = computed(() => FAQS[route.path] || [])

// Emit FAQPage structured data so Google can show the Q&A as rich results.
useHead(computed(() => ({
  script: items.value.length
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': items.value.map(f => ({
            '@type': 'Question',
            'name': f.q,
            'acceptedAnswer': { '@type': 'Answer', 'text': f.a },
          })),
        }),
      }]
    : [],
})))
</script>

<template>
  <section v-if="items.length" class="faq container">
    <h2 class="faq__title">{{ $t('common.faq') }}</h2>
    <div class="faq__list">
      <details v-for="(f, i) in items" :key="i" class="faq__item">
        <summary class="faq__q">
          <span>{{ f.q }}</span>
          <BaseIcon name="chevron" :size="18" />
        </summary>
        <p class="faq__a">{{ f.a }}</p>
      </details>
    </div>
  </section>
</template>

<style scoped lang="scss">
.faq {
  padding-block: spacing(10) spacing(4);
}

.faq__title {
  font-size: $text-2xl;
  letter-spacing: -0.02em;
  margin-bottom: spacing(5);
  text-align: center;
}

.faq__list {
  max-width: 760px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: spacing(2);
}

.faq__item {
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  background: var(--color-surface);
  overflow: hidden;
}

.faq__q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: spacing(3);
  padding: spacing(4);
  font-weight: 600;
  font-size: $text-base;
  cursor: pointer;
  list-style: none;
  color: var(--color-text);

  &::-webkit-details-marker { display: none; }

  :deep(svg) { flex-shrink: 0; color: var(--color-text-subtle); transition: transform $transition-fast; }
}

.faq__item[open] .faq__q :deep(svg) { transform: rotate(180deg); }

.faq__a {
  padding: 0 spacing(4) spacing(4);
  color: var(--color-text-muted);
  font-size: $text-sm;
  line-height: 1.7;
}
</style>
