<script setup lang="ts">
import { LANDING_PAGES } from '#shared/utils/landing'

const minifiers = LANDING_PAGES.filter(page => page.mode === 'minify')
const beautifiers = LANDING_PAGES.filter(page => page.mode === 'beautify')
</script>

<template>
  <section class="popular" aria-label="Popular tools">
    <div class="container">
      <h2 class="popular__heading">{{ $t('popular.heading') }}</h2>

      <div class="popular__cols">
        <div class="popular__col">
          <h3 class="popular__col-title">
            <BaseIcon name="minify" :size="16" /> {{ $t('popular.minifiers') }}
          </h3>
          <ul class="popular__links" role="list">
            <li v-for="page in minifiers" :key="page.slug">
              <NuxtLink :to="`/${page.slug}`">Minify {{ page.label }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="popular__col">
          <h3 class="popular__col-title">
            <BaseIcon name="beautify" :size="16" /> {{ $t('popular.beautifiers') }}
          </h3>
          <ul class="popular__links" role="list">
            <li v-for="page in beautifiers" :key="page.slug">
              <NuxtLink :to="`/${page.slug}`">Beautify {{ page.label }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="popular__col">
          <h3 class="popular__col-title">
            <BaseIcon name="layers" :size="16" /> {{ $t('popular.more') }}
          </h3>
          <ul class="popular__links" role="list">
            <li><NuxtLink to="/convert">{{ $t('popular.convert') }}</NuxtLink></li>
            <li><NuxtLink to="/compare">{{ $t('popular.compare') }}</NuxtLink></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.popular {
  padding-block: spacing(4) spacing(16);
}

.popular__heading {
  font-size: $text-2xl;
  text-align: center;
}

.popular__cols {
  margin-top: spacing(8);
  display: grid;
  gap: spacing(6);
  grid-template-columns: 1fr;

  @include respond('sm') {
    grid-template-columns: repeat(3, 1fr);
  }
}

.popular__col-title {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  font-size: $text-base;
  color: var(--color-text);
}

.popular__links {
  margin-top: spacing(3);
  display: flex;
  flex-direction: column;
  gap: spacing(1);

  a {
    display: inline-block;
    padding: spacing(1.5) 0;
    color: var(--color-text-muted);
    font-size: $text-sm;
    font-weight: 500;
    transition: color $transition-fast;

    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>
