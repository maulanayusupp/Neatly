<script setup lang="ts">
import { LANGUAGES } from '#shared/utils/languages'

const year = 2026
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner container">
      <div class="app-footer__brand">
        <NeatlyLogo :size="28" />
        <p class="app-footer__tagline">Make your code neat, instantly.</p>
      </div>

      <ul class="app-footer__langs" role="list">
        <li v-for="lang in LANGUAGES" :key="lang.id">{{ lang.label }}</li>
      </ul>

      <p class="app-footer__meta">
        © {{ year }} Neatly · Runs privately in your browser session.
      </p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

.app-footer__inner {
  padding-block: spacing(8);
  display: grid;
  gap: spacing(5);

  @include respond('md') {
    grid-template-columns: 1fr auto;
    align-items: center;
    row-gap: spacing(4);
  }
}

.app-footer__tagline {
  margin-top: spacing(2);
  color: var(--color-text-muted);
  font-size: $text-sm;
}

.app-footer__langs {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2) spacing(4);
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--color-text-muted);
  font-size: $text-sm;
  font-weight: 600;

  @include respond('md') {
    justify-content: flex-end;
  }
}

.app-footer__meta {
  color: var(--color-text-subtle);
  font-size: $text-xs;

  @include respond('md') {
    grid-column: 1 / -1;
  }
}
</style>
