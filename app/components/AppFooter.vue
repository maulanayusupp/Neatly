<script setup lang="ts">
import { ALL_TOOLS } from '~/utils/tools'

const year = 2026

const toolLinks = ALL_TOOLS

const aboutLinks = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const legalLinks = [
  { to: '/terms', label: 'Terms of Service' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/disclaimer', label: 'Disclaimer' },
]
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner container">
      <div class="app-footer__brand">
        <NeatlyLogo :size="28" />
        <p class="app-footer__tagline">Make your code neat, instantly.</p>
      </div>

      <nav class="app-footer__col" aria-label="Tools">
        <h2 class="app-footer__col-title">Tools</h2>
        <ul role="list">
          <li v-for="link in toolLinks" :key="link.to">
            <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <nav class="app-footer__col" aria-label="About">
        <h2 class="app-footer__col-title">About</h2>
        <ul role="list">
          <li v-for="link in aboutLinks" :key="link.to">
            <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <nav class="app-footer__col" aria-label="Legal">
        <h2 class="app-footer__col-title">Legal</h2>
        <ul role="list">
          <li v-for="link in legalLinks" :key="link.to">
            <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="app-footer__meta">
        <span>© {{ year }} Neatly · Your code is processed privately and never stored.</span>
        <InstallButton />
      </div>
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
  padding-block: spacing(10);
  display: grid;
  gap: spacing(8);
  grid-template-columns: 1fr;

  @include respond('sm') {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @include respond('md') {
    grid-template-columns: 1.8fr 1fr 1fr 1fr;
    gap: spacing(6);
  }
}

.app-footer__brand {
  @include respond('sm') {
    grid-column: 1 / -1;
  }
  @include respond('md') {
    grid-column: auto;
  }
}

.app-footer__tagline {
  margin-top: spacing(3);
  max-width: 34ch;
  color: var(--color-text-muted);
  font-size: $text-sm;
}

.app-footer__col-title {
  font-size: $text-sm;
  font-weight: 700;
  color: var(--color-text);
}

.app-footer__col ul {
  margin-top: spacing(3);
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: spacing(2);
}

.app-footer__col a {
  color: var(--color-text-muted);
  font-size: $text-sm;
  transition: color $transition-fast;

  &:hover {
    color: var(--color-primary);
  }
}

.app-footer__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: spacing(3);
  color: var(--color-text-subtle);
  font-size: $text-xs;

  @include respond('md') {
    grid-column: 1 / -1;
    border-top: 1px solid var(--color-border);
    padding-top: spacing(5);
  }
}
</style>
