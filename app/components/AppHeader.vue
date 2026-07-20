<script setup lang="ts"></script>

<template>
  <header class="app-header">
    <div class="app-header__inner container">
      <NuxtLink to="/" class="app-header__brand" aria-label="Neatly home">
        <NeatlyLogo :size="34" />
      </NuxtLink>

      <nav class="app-header__actions" aria-label="Primary">
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
</style>
