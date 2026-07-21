<script setup lang="ts">
import { ALL_TOOLS, TOOL_GROUPS } from '~/utils/tools'

// Keep og:url / canonical accurate per page. The static defaults in
// nuxt.config point at the homepage; override them with the current route so
// social cards and search engines see the real page URL.
const route = useRoute()
const { public: { siteUrl, siteName } } = useRuntimeConfig()
const pageUrl = computed(() => `${siteUrl}${route.path === '/' ? '' : route.path}`)

useHead({
  meta: [
    { property: 'og:url', content: () => pageUrl.value },
    { name: 'twitter:url', content: () => pageUrl.value },
  ],
  // Vercel Web Analytics (cookieless, privacy-friendly). Served by Vercel at
  // this same-origin path in production; skipped in dev to avoid a 404.
  script: import.meta.env.PROD ? [{ src: '/_vercel/insights/script.js', defer: true }] : [],
})

// Per-tool structured data: SoftwareApplication (app rich results) +
// BreadcrumbList (breadcrumb in SERP). The homepage already emits its own
// WebApplication JSON-LD, so it is skipped here.
const currentTool = computed(() => ALL_TOOLS.find(t => t.to === route.path))
const currentGroup = computed(() => TOOL_GROUPS.find(g => g.tools.some(t => t.to === route.path)))

useHead(computed(() => {
  const tool = currentTool.value
  if (!tool || route.path === '/')
    return {}
  const url = pageUrl.value
  return {
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': `${tool.label} — ${siteName}`,
          'description': tool.desc,
          'url': url,
          'applicationCategory': 'DeveloperApplication',
          'operatingSystem': 'Any',
          'isAccessibleForFree': true,
          'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        }),
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': siteUrl },
            ...(currentGroup.value ? [{ '@type': 'ListItem', 'position': 2, 'name': currentGroup.value.name, 'item': `${siteUrl}/tools` }] : []),
            { '@type': 'ListItem', 'position': currentGroup.value ? 3 : 2, 'name': tool.label, 'item': url },
          ],
        }),
      },
    ],
  }
}))
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <NuxtPage />
      <RelatedTools />
      <ToolFaq />
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
