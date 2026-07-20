<script setup lang="ts">
import { TOOL_GROUPS } from '~/utils/tools'

const year = 2026

const aboutLinks = [
  { to: '/about', key: 'linkAbout' },
  { to: '/contact', key: 'linkContact' },
]

const legalLinks = [
  { to: '/terms', key: 'linkTerms' },
  { to: '/privacy', key: 'linkPrivacy' },
  { to: '/disclaimer', key: 'linkDisclaimer' },
]
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner container">
      <div class="app-footer__brand">
        <NeatlyLogo :size="28" />
        <p class="app-footer__tagline">{{ $t('footer.tagline') }}</p>
      </div>

      <div class="app-footer__cols">
        <nav
          v-for="group in TOOL_GROUPS"
          :key="group.key"
          class="app-footer__col"
          :aria-label="$t(`groups.${group.key}`)"
        >
          <h2 class="app-footer__col-title">{{ $t(`groups.${group.key}`) }}</h2>
          <ul role="list">
            <li v-for="link in group.tools" :key="link.to">
              <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="app-footer__secondary">
        <nav class="app-footer__col" :aria-label="$t('footer.about')">
          <h2 class="app-footer__col-title">{{ $t('footer.about') }}</h2>
          <ul role="list">
            <li v-for="link in aboutLinks" :key="link.to">
              <NuxtLink :to="link.to">{{ $t(`footer.${link.key}`) }}</NuxtLink>
            </li>
          </ul>
        </nav>

        <nav class="app-footer__col" :aria-label="$t('footer.legal')">
          <h2 class="app-footer__col-title">{{ $t('footer.legal') }}</h2>
          <ul role="list">
            <li v-for="link in legalLinks" :key="link.to">
              <NuxtLink :to="link.to">{{ $t(`footer.${link.key}`) }}</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="app-footer__meta">
        <span>© {{ year }} Neatly · {{ $t('footer.rights') }}</span>
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
  display: flex;
  flex-direction: column;
  gap: spacing(8);
}

.app-footer__tagline {
  margin-top: spacing(3);
  max-width: 34ch;
  color: var(--color-text-muted);
  font-size: $text-sm;
}

.app-footer__cols {
  display: grid;
  gap: spacing(6) spacing(5);
  grid-template-columns: repeat(2, 1fr);

  @include respond('sm') {
    grid-template-columns: repeat(3, 1fr);
  }

  @include respond('md') {
    grid-template-columns: repeat(5, 1fr);
  }
}

.app-footer__secondary {
  display: grid;
  gap: spacing(6) spacing(5);
  grid-template-columns: repeat(2, 1fr);
  padding-top: spacing(7);
  border-top: 1px solid var(--color-border);

  @include respond('md') {
    grid-template-columns: repeat(5, 1fr);
  }
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
  border-top: 1px solid var(--color-border);
  padding-top: spacing(5);
}
</style>
