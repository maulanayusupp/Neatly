import { fileURLToPath } from 'node:url'

// Absolute path to the SCSS "abstracts" layer (variables, mixins, functions).
// Injected into every component <style lang="scss"> block so design tokens are
// available everywhere without a manual @use in each file.
const scssAbstracts = fileURLToPath(
  new URL('./app/assets/scss/abstracts', import.meta.url),
).replace(/\\/g, '/')

const siteUrl = 'https://neatlyapp.vercel.app'
const siteName = 'Neatly'
const siteTitle = 'Neatly — Beautify, Minify & Unminify JavaScript, CSS, HTML, JSON, XML'
const siteDescription
  = 'Free online code beautifier, minifier & unminifier for JavaScript, CSS, HTML, JSON, YAML, CSV and XML. Convert formats, compare JSON, and scan QR codes & barcodes — fast and private.'
const ogImage = `${siteUrl}/og-image.png`

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: true },

  css: ['~/assets/scss/main.scss'],

  runtimeConfig: {
    // Hard limit for the payload we are willing to transform (in bytes).
    maxInputBytes: 5 * 1024 * 1024,
    public: {
      siteUrl,
      siteName,
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
        { property: 'og:image:alt', content: 'Neatly — beautify, minify and unminify code' },
        { property: 'og:locale', content: 'en_US' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: siteTitle },
        { name: 'twitter:description', content: siteDescription },
        { name: 'twitter:image', content: ogImage },
        { name: 'twitter:image:alt', content: 'Neatly — beautify, minify and unminify code' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: siteUrl },
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
