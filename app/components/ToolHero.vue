<script setup lang="ts">
import type { IconName } from '~/utils/icons'

defineProps<{
  icon: IconName
  badge: string
  title: string
  gradient: string
  lead: string
}>()
</script>

<template>
  <section class="tool-hero">
    <div class="container tool-hero__inner">
      <span class="tool-hero__badge">
        <BaseIcon :name="icon" :size="15" />
        {{ badge }}
      </span>
      <h1 class="tool-hero__title">
        {{ title }} <span class="text-gradient">{{ gradient }}</span>
      </h1>
      <p class="tool-hero__lead">{{ lead }}</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.tool-hero {
  padding-block: spacing(12) spacing(6);
  text-align: center;
}

.tool-hero__badge {
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

.tool-hero__title {
  margin-top: spacing(5);
  font-size: $text-4xl;
  letter-spacing: -0.035em;
}

.tool-hero__lead {
  margin: spacing(4) auto 0;
  max-width: 58ch;
  color: var(--color-text-muted);
  font-size: $text-lg;
}
</style>
