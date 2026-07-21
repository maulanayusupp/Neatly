<script setup lang="ts">
// Keep og:url / canonical accurate per page. The static defaults in
// nuxt.config point at the homepage; override them with the current route so
// social cards and search engines see the real page URL.
const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()
const pageUrl = computed(() => `${siteUrl}${route.path === '/' ? '' : route.path}`)

useHead({
  meta: [
    { property: 'og:url', content: () => pageUrl.value },
    { name: 'twitter:url', content: () => pageUrl.value },
  ],
})
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <NuxtPage />
    </main>
    <AppFooter />
    <ToastHost />
    <CommandPalette />
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
}

.app-main {
  flex: 1;
}
</style>
