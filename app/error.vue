<script setup lang="ts">
import type { NuxtError } from '#app'
import { ALL_TOOLS } from '~/utils/tools'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)
const title = computed(() => (is404.value ? 'Page not found' : 'Something went wrong'))

useHead({ title: `${props.error.statusCode} · Neatly` })

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page">
    <header class="error-page__top container">
      <NuxtLink to="/" aria-label="Neatly home" @click.prevent="goHome">
        <NeatlyLogo :size="32" />
      </NuxtLink>
    </header>

    <main class="error-page__main container">
      <span class="error-page__code text-gradient">{{ error.statusCode || 500 }}</span>
      <h1 class="error-page__title">{{ title }}</h1>
      <p class="error-page__text">
        {{ is404
          ? "The page you’re looking for doesn’t exist or has moved."
          : "An unexpected error occurred. Please try again." }}
      </p>

      <div class="error-page__actions">
        <BaseButton variant="primary" icon="sparkles" @click="goHome">Back to Neatly</BaseButton>
      </div>

      <nav class="error-page__tools" aria-label="Tools">
        <p class="error-page__tools-title">Or jump to a tool</p>
        <div class="error-page__links">
          <NuxtLink v-for="tool in ALL_TOOLS" :key="tool.to" :to="tool.to">
            <BaseIcon :name="tool.icon" :size="15" /> {{ tool.label }}
          </NuxtLink>
        </div>
      </nav>
    </main>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.error-page__top {
  padding-block: spacing(5);
}

.error-page__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-block: spacing(10) spacing(16);
}

.error-page__code {
  font-size: clamp(4rem, 18vw, 9rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
}

.error-page__title {
  margin-top: spacing(4);
  font-size: $text-3xl;
}

.error-page__text {
  margin-top: spacing(3);
  max-width: 44ch;
  color: var(--color-text-muted);
  font-size: $text-lg;
}

.error-page__actions {
  margin-top: spacing(6);
}

.error-page__tools {
  margin-top: spacing(12);
}

.error-page__tools-title {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-subtle);
}

.error-page__links {
  margin-top: spacing(4);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: spacing(2);

  a {
    display: inline-flex;
    align-items: center;
    gap: spacing(1.5);
    padding: spacing(2) spacing(3.5);
    border-radius: $radius-pill;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-muted);
    font-size: $text-sm;
    font-weight: 600;
    transition: color $transition-fast, border-color $transition-fast, background-color $transition-fast;

    &:hover {
      color: var(--color-primary);
      border-color: var(--color-primary);
      background: var(--color-brand-soft);
    }
  }
}
</style>
