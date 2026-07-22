import { fileURLToPath } from 'node:url'

// Absolute path to the SCSS "abstracts" layer (variables, mixins, functions).
// Injected into every component <style lang="scss"> block so design tokens are
// available everywhere without a manual @use in each file.
const scssAbstracts = fileURLToPath(
  new URL('./app/assets/scss/abstracts', import.meta.url),
).replace(/\\/g, '/')

// Single source of truth for the public origin. Override per environment with
// NUXT_PUBLIC_SITE_URL (e.g. set it in Vercel when moving to a custom domain);
// everything else — canonical, og:url, og:image, sitemap, robots, JSON-LD —
// derives from this, so switching domains is a one-value change.
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://withneatly.com'
const siteName = 'Neatly'
const siteTitle = 'Neatly — Free Online Developer Tools'
const siteDescription
  = 'A free developer toolkit to get your work done: beautify & minify code, format & validate JSON, convert JSON/YAML/CSV/XML, diff & compare, scan & generate QR codes, format SQL, explain cron, plus Base64, JWT, hash, UUID, password and 20+ more tools. Fast, private, no sign-up.'
const ogImage = `${siteUrl}/og-image.png`

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: true },

  modules: ['@vite-pwa/nuxt', '@nuxtjs/i18n'],

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    lazy: true,
    locales: [
      { code: 'en', name: 'English', language: 'en-US', file: 'en.json' },
      { code: 'id', name: 'Bahasa Indonesia', language: 'id-ID', file: 'id.json' },
      { code: 'ms', name: 'Bahasa Melayu', language: 'ms-MY', file: 'ms.json' },
      { code: 'fil', name: 'Filipino', language: 'fil-PH', file: 'fil.json' },
      { code: 'vi', name: 'Tiếng Việt', language: 'vi-VN', file: 'vi.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'neatly-lang',
      alwaysRedirect: false,
    },
  },

  css: ['~/assets/scss/main.scss'],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Neatly — Beautify, Minify & Unminify code',
      short_name: 'Neatly',
      description: siteDescription,
      theme_color: '#6366f1',
      background_color: '#0b0d16',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,webmanifest}'],
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: { cacheName: 'neatly-pages', networkTimeoutSeconds: 3 },
        },
        {
          urlPattern: ({ request }) => ['style', 'script', 'image', 'font'].includes(request.destination),
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'neatly-assets' },
        },
      ],
    },
    client: { installPrompt: true },
    devOptions: { enabled: false },
  },

  runtimeConfig: {
    // Hard limit for the payload we are willing to transform (in bytes).
    maxInputBytes: 5 * 1024 * 1024,
    public: {
      siteUrl,
      siteName,
    },
  },

  // Baseline security headers on every response.
  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'SAMEORIGIN',
        'Permissions-Policy': 'camera=(self), microphone=(), geolocation=(), browsing-topics=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: siteTitle,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: siteDescription },
        { name: 'theme-color', content: '#6366f1' },
        { name: 'application-name', content: siteName },
        { name: 'author', content: siteName },
        // Google Search Console (URL-prefix property verification).
        { name: 'google-site-verification', content: 'F2KymLMORrC560w-JNyiW2zmYSOLdgOVwKsrwM91-wM' },
        // Open Graph (used by WhatsApp, Facebook, LinkedIn, etc.)
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteName },
        { property: 'og:title', content: siteTitle },
        { property: 'og:description', content: siteDescription },
        { property: 'og:url', content: siteUrl },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:secure_url', content: ogImage },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Neatly — free online developer tools' },
        { property: 'og:locale', content: 'en_US' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: siteTitle },
        { name: 'twitter:description', content: siteDescription },
        { name: 'twitter:image', content: ogImage },
        { name: 'twitter:image:alt', content: 'Neatly — free online developer tools' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        // canonical is set per-route in app.vue (derived from the runtime siteUrl).
      ],
      script: [
        {
          // Set the theme before first paint to avoid a flash of the wrong theme.
          innerHTML:
            '(function(){try{var t=localStorage.getItem("neatly-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;}catch(e){}})();',
          type: 'text/javascript',
        },
      ],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `@use "${scssAbstracts}" as *;\n`,
        },
      },
    },
  },

  nitro: {
    compressPublicAssets: true,
  },

  typescript: {
    strict: true,
  },
})
