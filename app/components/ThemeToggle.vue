<script setup lang="ts">
const { theme, toggleTheme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :title="isDark ? 'Light mode' : 'Dark mode'"
    @click="toggleTheme"
  >
    <ClientOnly>
      <BaseIcon :name="isDark ? 'sun' : 'moon'" :size="18" />
      <template #fallback>
        <BaseIcon name="moon" :size="18" />
      </template>
    </ClientOnly>
  </button>
</template>

<style scoped lang="scss">
.theme-toggle {
  @include button-reset;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  transition: color $transition-fast, border-color $transition-fast, background-color $transition-fast;

  &:hover {
    color: var(--color-text);
    border-color: var(--color-border-strong);
    background: var(--color-surface-2);
  }
}
</style>
