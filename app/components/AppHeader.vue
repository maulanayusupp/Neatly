<script setup lang="ts">
const repoUrl = 'https://github.com'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner container">
      <NuxtLink to="/" class="app-header__brand" aria-label="Neatly home">
        <NeatlyLogo :size="34" />
      </NuxtLink>

      <nav class="app-header__actions" aria-label="Primary">
        <a
          class="app-header__link"
          :href="repoUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
        >
          <BaseIcon name="github" :size="18" />
          <span class="app-header__link-label">GitHub</span>
        </a>
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

.app-header__link {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  height: 2.5rem;
  padding-inline: spacing(3);
  border-radius: $radius-md;
  color: var(--color-text-muted);
  font-size: $text-sm;
  font-weight: 600;
  transition: color $transition-fast, background-color $transition-fast;

  &:hover {
    color: var(--color-text);
    background: var(--color-surface-2);
  }
}

.app-header__link-label {
  display: none;

  @include respond('sm') {
    display: inline;
  }
}
</style>
