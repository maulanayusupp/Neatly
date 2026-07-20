<script setup lang="ts">
const { toggle } = useCommandPalette()
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner container">
      <NuxtLink to="/" class="app-header__brand" aria-label="Neatly home">
        <NeatlyLogo :size="34" />
      </NuxtLink>

      <nav class="app-header__actions" aria-label="Primary">
        <button class="app-header__search" type="button" :aria-label="$t('palette.open')" @click="toggle">
          <BaseIcon name="search" :size="16" />
          <span class="app-header__search-label">{{ $t('palette.open') }}</span>
          <kbd class="app-header__kbd">⌘K</kbd>
        </button>
        <NavMenu />
        <LanguageSwitcher />
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: $z-sticky;
  background: color-mix(in srgb, var(--color-bg) 82%, transparent);
  backdrop-filter: saturate(140%) blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.app-header__inner {
  height: $header-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: spacing(2);
}

.app-header__search {
  @include button-reset;
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  height: 2.5rem;
  padding-inline: spacing(3);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-subtle);
  font-size: $text-sm;
  transition: color $transition-fast, border-color $transition-fast, background-color $transition-fast;

  &:hover {
    color: var(--color-text);
    border-color: var(--color-border-strong);
    background: var(--color-surface-2);
  }
}

.app-header__search-label {
  display: none;

  @include respond('md') { display: inline; }
}

.app-header__kbd {
  display: none;
  padding: 1px 5px;
  border-radius: $radius-xs;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  font-family: $font-mono;
  font-size: 0.7rem;

  @include respond('md') { display: inline-block; }
}
</style>
