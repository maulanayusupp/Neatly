# CLAUDE.md

Guidance for AI assistants (and humans) working in this repo.

## Project

**Neatly** — a modern developer-tools site built with **Nuxt 4** (Vue 3, Nitro).
Tagline: _"Make your code neat, instantly."_ Deployed at `neatlyapp.vercel.app`.
Repo: `github.com/maulanayusupp/Neatly` (branch `main`, SSH remote `origin`).

## Tools / pages

| Route              | What it does |
| ------------------ | ------------ |
| `/`                | Beautify & minify JS/TS, CSS, HTML, JSON, XML. Auto-detect, live highlighting, active-line highlight, gzip size, jump-to-error, shareable links (`#s=`). |
| `/convert`         | Convert between JSON, YAML, CSV, XML. |
| `/yaml`            | Validate YAML (precise error line/column), pretty-print, copy as YAML or JSON. Client-only (`js-yaml`). |
| `/compare`         | Diff 2–4 JSON inputs, outlier detection + conclusion. |
| `/json-viewer`     | Validate JSON (error line), collapsible tree view, stats, format/minify/sort-keys. |
| `/scan`            | **Client-only** QR + barcode scanner (camera / upload / paste) via `@zxing/browser`. No backend. |
| `/qr-generator`    | **Client-only** QR + barcode generator (`qrcode`, `jsbarcode`); URL/text/Wi-Fi/email/phone/vCard, PNG+SVG export. |
| `/base64`, `/url-encode`, `/jwt-decoder`, `/hash`, `/uuid`, `/timestamp` | Client-only dev tools (Base64, URL, JWT decode, SHA hashes via Web Crypto, UUID v4, epoch converter). |
| `/timezone`        | Client-only timezone converter (Intl APIs): convert a moment across many zones at once, DST-aware, add/remove zones. Interactive part wrapped in `<ClientOnly>` (depends on the visitor's local zone). |
| `/text-tools`      | Client-only text utilities: word/char/line/sentence/paragraph counts, sort/dedupe/reverse/trim lines, add line numbers, change case, collapse spaces, find & replace (regex). |
| `/meta-tags`       | Client-only SEO/Open Graph/Twitter meta-tag generator with live Google, Facebook and Twitter card previews. |
| `/url-parser`      | Client-only URL parser: split a URL into protocol/host/port/path/query/fragment, edit query params, and rebuild the link (`URL` API). |
| `/diff`, `/color`, `/regex`, `/json-to-typescript` | Client-only: text diff (`diff`), color converter + WCAG contrast, regex tester, JSON→TS (`json-to-ts`). |
| `/minify-<lang>`, `/beautify-<lang>` | 10 generated SEO landing pages (`[slug].vue` + `shared/utils/landing.ts`). |
| `/tools`           | Directory of all tools (grouped cards). Linked from the Tools dropdown ("View all tools") and sitemap. |
| `/about`, `/contact` | About Neatly + contact page (author: Maulana). Linked from the footer "About" column (not the header). |
| `/terms`, `/privacy`, `/disclaimer`  | Legal pages (`LegalArticle.vue`). |
| `/sitemap.xml`     | Generated in `server/routes/sitemap.xml.ts`. |

## Architecture & conventions

- **Nuxt 4 layout**: app code in `app/`, server in `server/`, cross-cutting code
  in `shared/` (`#shared` alias; auto-imported `shared/utils` + `shared/types`).
- **Server services** hold transform logic: `server/services/*.service.ts`,
  orchestrated by `transform.service.ts`; API handlers only validate + map errors.
- **Shared composable stores** for UI state (`useTransform`, `useConvert`,
  `useJsonCompare`, `useQrScanner`) — backed by `useState`, no prop drilling.
- **SCSS design system** in `app/assets/scss/`:
  - `abstracts/` (variables, functions, mixins) is auto-injected into every
    component `<style lang="scss">` via `nuxt.config` `additionalData` — do **not**
    `@use` it again inside components.
  - Theme tokens are CSS custom properties in `base/_tokens.scss` (light + dark).
  - **No inline styles.** Dynamic values go through CSS custom properties set in
    script (e.g. `--active-line-top`), never `style="…"`.
- **Highlighting**: `app/utils/highlight.ts` (highlight.js core + selected grammars).
- **Client-only libs** (e.g. `@zxing/browser`) must be **lazy-loaded** inside
  functions and wrapped in `<ClientOnly>` so SSR stays clean.
- Icons are inline SVG in `app/utils/icons.ts` (no icon dependency).
- **Security headers** are set for all routes via `routeRules['/**'].headers` in
  `nuxt.config` (nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy
  with `camera=(self)`, HSTS). Only functional cookies/localStorage are used
  (`neatly-lang`, `neatly-theme`, `neatly-beep`) — no consent banner needed
  unless analytics/tracking is added.
- **PWA** via `@vite-pwa/nuxt` (`pwa` config in `nuxt.config`): installable
  manifest + service worker (autoUpdate) with runtime caching. `<InstallButton>`
  shows the install prompt. `error.vue` is the custom 404/500 page.
- **i18n** via `@nuxtjs/i18n` (`no_prefix`, cookie `neatly-lang`). Locales:
  **en, id, ms, fil, vi** in `i18n/locales/*.json`. `<LanguageSwitcher>` in the
  header. **RULE: any new/changed static UI label must be added to ALL 5 locale
  files** (use `$t('key')`; never hardcode user-facing chrome text). Tool
  proper-name labels in `app/utils/tools.ts` may stay in English; group names,
  chrome, home, features and popular-tools text are translated.

## Commands

```bash
npm run dev        # dev server (http://localhost:3000)
npm run build      # production build (also the main correctness check)
npm run preview    # run the built server
npm test           # run the Vitest unit tests (test/*.test.ts)
node scripts/generate-icons.mjs   # regenerate favicons from public/favicon.svg
```

Verify changes with `npm run build`, then run the built server and curl the API
/ SSR output (no browser is assumed to be available).

## Working agreements

- **Commit + push after every individual feature/change** — do not batch.
  End commit messages with the `Co-Authored-By` trailer.
- **Keep this file and the legal pages in sync with the features.** Whenever a
  feature is added or changed, update:
  - this `CLAUDE.md` (tools table + any new convention), and
  - `/terms`, `/privacy`, `/disclaimer` if the change affects what the service
    does or how data is handled (e.g. camera access, new processing).
- `README.md` is intentionally untracked (global gitignore); keep docs here.
- Legal pages are honest templates — real entity/contact and jurisdiction review
  are still the owner's responsibility.
