<script setup lang="ts">
// $pwa is provided by @vite-pwa/nuxt (client only). Typed loosely on purpose.
const pwa = useNuxtApp().$pwa as
  | { showInstallPrompt?: boolean, isPWAInstalled?: boolean, install?: () => void }
  | undefined
</script>

<template>
  <ClientOnly>
    <button
      v-if="pwa?.showInstallPrompt && !pwa?.isPWAInstalled"
      class="install-btn"
      type="button"
      @click="pwa?.install?.()"
    >
      <BaseIcon name="download" :size="15" />
      Install app
    </button>
  </ClientOnly>
</template>

<style scoped lang="scss">
.install-btn {
  @include button-reset;

  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(2) spacing(3.5);
  border-radius: $radius-pill;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: $text-sm;
  font-weight: 600;
  transition: color $transition-fast, border-color $transition-fast, background-color $transition-fast;

  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
    background: var(--color-brand-soft);
  }
}
</style>
