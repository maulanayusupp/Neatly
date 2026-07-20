<script setup lang="ts">
import type { LanguageId } from '#shared/types'
import { LANGUAGES } from '#shared/utils/languages'

defineProps<{
  language: LanguageId
  auto: boolean
  detected: LanguageId
}>()

const emit = defineEmits<{
  select: [id: LanguageId]
  auto: []
}>()
</script>

<template>
  <div class="lang-tabs" role="group" aria-label="Language">
    <button
      class="lang-tabs__tab"
      type="button"
      :class="{ 'is-active': auto }"
      :aria-pressed="auto"
      @click="emit('auto')"
    >
      <BaseIcon name="sparkles" :size="15" />
      <span>Auto</span>
    </button>

    <span class="lang-tabs__divider" aria-hidden="true" />

    <button
      v-for="lang in LANGUAGES"
      :key="lang.id"
      class="lang-tabs__tab"
      type="button"
      :class="{
        'is-active': !auto && language === lang.id,
        'is-detected': auto && detected === lang.id,
      }"
      :aria-pressed="!auto && language === lang.id"
      @click="emit('select', lang.id)"
    >
      {{ lang.short }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.lang-tabs {
  display: flex;
  align-items: center;
  gap: spacing(1);
  flex-wrap: wrap;
}

.lang-tabs__divider {
  width: 1px;
  align-self: stretch;
  margin-inline: spacing(1);
  background: var(--color-border);
}

.lang-tabs__tab {
  @include button-reset;

  position: relative;
  display: inline-flex;
  align-items: center;
  gap: spacing(1.5);
  padding: spacing(1.5) spacing(3);
  border-radius: $radius-sm;
  border: 1px solid transparent;
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: color $transition-fast, background-color $transition-fast, border-color $transition-fast;

  &:hover {
    color: var(--color-text);
    background: var(--color-surface-2);
  }

  &.is-active {
    color: var(--color-primary);
    background: var(--color-brand-soft);
    border-color: transparent;
  }

  &.is-detected::after {
    content: '';
    position: absolute;
    top: 4px;
    right: 4px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-primary);
  }
}
</style>
