<script setup lang="ts">
const store = useJsonCompare()
const { sources, report, status, errors, canAdd, canRemove } = store

const { t } = useI18n()

useSeoMeta({
  title: () => t('compare.metaTitle'),
  description: () => t('compare.metaDesc'),
  ogTitle: () => t('compare.metaTitle'),
  ogDescription: () => t('compare.metaDesc'),
  twitterTitle: () => t('compare.metaTitle'),
  twitterDescription: () => t('compare.metaDesc'),
})

useHead({
  link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/compare' }],
})
</script>

<template>
  <div class="compare">
    <section class="hero">
      <div class="container hero__inner">
        <span class="hero__badge">
          <BaseIcon name="layers" :size="15" />
          {{ $t('compare.badge') }}
        </span>
        <h1 class="hero__title">
          {{ $t('compare.titleA') }} <span class="text-gradient">{{ $t('compare.titleHl') }}</span>
        </h1>
        <p class="hero__lead">{{ $t('compare.lead') }}</p>
      </div>
    </section>

    <section class="container compare__body">
      <div class="compare__toolbar">
        <div class="compare__toolbar-left">
          <BaseButton icon="layers" :disabled="!canAdd" @click="store.addSource">
            {{ $t('compare.addJson') }}
          </BaseButton>
          <span class="compare__count">{{ sources.length }} / 4</span>
        </div>
        <div class="compare__toolbar-right">
          <BaseButton variant="ghost" icon="sparkles" @click="store.loadExample">
            {{ $t('compare.loadExample') }}
          </BaseButton>
          <BaseButton variant="ghost" icon="trash" @click="store.clearAll">
            {{ $t('common.clear') }}
          </BaseButton>
          <BaseButton variant="primary" size="lg" icon="minify" @click="store.run">
            {{ $t('compare.run') }}
          </BaseButton>
        </div>
      </div>

      <div class="compare__grid" :class="`compare__grid--${sources.length}`">
        <CompareCard
          v-for="(source, index) in sources"
          :key="source.id"
          :id="source.id"
          :label="compareLabel(index)"
          :text="source.text"
          :error="errors[source.id]"
          :removable="canRemove"
          @update="text => store.setText(source.id, text)"
          @remove="store.removeSource(source.id)"
        />
      </div>

      <p v-if="status === 'error'" class="compare__error">
        <BaseIcon name="alert" :size="16" />
        {{ $t('compare.fixError') }}
      </p>

      <CompareResult v-if="report && status === 'success'" :report="report" class="compare__result" />
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

.compare__body {
  padding-bottom: spacing(12);
  display: flex;
  flex-direction: column;
  gap: spacing(5);
}

.compare__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: spacing(3);
  padding: spacing(4);
  @include card;
}

.compare__toolbar-left,
.compare__toolbar-right {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: spacing(2);
}

.compare__count {
  font-size: $text-sm;
  font-weight: 700;
  color: var(--color-text-subtle);
  font-variant-numeric: tabular-nums;
}

.compare__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('md') {
    grid-template-columns: repeat(2, 1fr);
  }
}

.compare__error {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(3) spacing(4);
  border-radius: $radius-md;
  background: var(--color-danger-soft);
  color: var(--color-danger);
  font-size: $text-sm;
  font-weight: 600;
}

.compare__result {
  margin-top: spacing(2);
}
</style>
