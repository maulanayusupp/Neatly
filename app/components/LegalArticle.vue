<script setup lang="ts">
defineProps<{
  title: string
  intro: string
  updated: string
}>()
</script>

<template>
  <article class="legal">
    <div class="container legal__inner">
      <header class="legal__header">
        <h1 class="legal__title">{{ title }}</h1>
        <p class="legal__intro">{{ intro }}</p>
        <p class="legal__updated">Last updated: {{ updated }}</p>
      </header>

      <div class="legal__body">
        <slot />
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.legal {
  padding-block: spacing(12) spacing(16);
}

.legal__inner {
  max-width: 760px;
}

.legal__title {
  font-size: $text-3xl;
}

.legal__intro {
  margin-top: spacing(3);
  color: var(--color-text-muted);
  font-size: $text-lg;
}

.legal__updated {
  margin-top: spacing(3);
  color: var(--color-text-subtle);
  font-size: $text-sm;
}

.legal__body {
  margin-top: spacing(8);

  :deep(h2) {
    margin-top: spacing(8);
    font-size: $text-xl;
  }

  :deep(p),
  :deep(li) {
    color: var(--color-text-muted);
    line-height: 1.7;
  }

  :deep(p) {
    margin-top: spacing(3);
  }

  :deep(ul) {
    margin-top: spacing(3);
    padding-left: spacing(5);
    display: flex;
    flex-direction: column;
    gap: spacing(2);
  }

  :deep(li) {
    list-style: disc;
  }

  :deep(a) {
    color: var(--color-primary);
    font-weight: 600;
  }

  :deep(strong) {
    color: var(--color-text);
  }
}
</style>
