# Next TODO

Deferred items to pick up later (not done yet).

## Growth & measurement
- [x] **Analytics** — Vercel Web Analytics via `/_vercel/insights/script.js`
      (cookieless), injected in `app.vue` for production only.
- [x] **Site `robots.txt`** (`server/routes/robots.txt.ts`) → points to sitemap.
- [x] **Per-page `og:url` / `twitter:url`** — set from the route in `app.vue`.
- [x] **Per-tool FAQ + `FAQPage` JSON-LD** — `ToolFaq.vue` + `app/utils/faqs.ts`
      (10 tools done: home, base64, json-viewer, jwt, url-encode, hash,
      timestamp, regex, timezone, meta-tags). _Expand to the remaining tools._
- [ ] **Google Search Console** — add verification meta + submit `/sitemap.xml`. _(owner)_
- [ ] **Prerender** static pages — `nitro.prerender` did not trigger under
      Nuxt 4.5 / Nitro 2.13 (+ @vite-pwa) — no phase, no error, 0 output.
      SSR already serves fully crawlable HTML, so this is a speed-only
      optimisation; revisit (likely a module interaction).
- [ ] **Per-page OG images** (currently all pages share one `/og-image.png`).
- [ ] `SoftwareApplication` + `BreadcrumbList` JSON-LD per tool; related-tools
      internal links.

## i18n — remaining
- [x] All tool pages + chrome localized in en/id/ms/fil/vi.
- [ ] Deep qr-generator form-field labels (SSID, Subject, Bar width, …).
- [ ] Localize generated content: JSON Compare conclusions, landing page
      titles/FAQ, and the legal pages (terms/privacy/disclaimer) full text.

## Tools — planned next (prioritised)
- [ ] **JSON → Go / Python / Java / C# / Kotlin** — extend the JSON→TypeScript engine to more target languages.
- [x] **Text utilities** (`/text-tools`) — counts, sort/dedupe/reverse/trim lines, case, find & replace.
- [x] **Timezone converter** (`/timezone`) — convert a moment across many zones, DST-aware.
- [x] **Meta tag / Open Graph generator** (`/meta-tags`) — SEO/OG/Twitter tags + live social preview.
- [x] **robots.txt generator** (`/robots-txt`) — per-agent rules, crawl-delay, sitemap, presets.
- [x] **URL parser** (`/url-parser`) — break a URL into parts, edit query params.
- [ ] **JWT builder / encoder** — sign HS256 client-side via Web Crypto (complements the decoder).
- [ ] **HTML entity encode/decode** + **string escape** (JSON/JS) — fills the encoding gap.
- [ ] **AES encrypt/decrypt** (Web Crypto, in-browser).
- [ ] **HMAC / MD5** on the Hash page; **ULID / nanoid** on the UUID page.
- [ ] **Recently used / Favorites** (localStorage) on home + command palette.
- [ ] **Per-tool FAQ + JSON-LD** for rich results (SEO).
- [ ] Per-page `og:url` + per-page OG images (SEO gaps found 2026-07-20).

## Tools (ideas / backlog)
- [x] Password generator (`/password`).
- [x] Markdown → HTML + preview (`/markdown`).
- [x] SQL formatter (`/sql`).
- [x] Cron expression explainer (`/cron`).
- [x] Number base converter (`/number-base`).
- [x] Image → Base64 / data URI (`/image-to-base64`).
- [ ] Image tools: compress, favicon generator
- [x] Case / slug converter (`/case`).
- [x] Lorem ipsum generator (`/lorem`).
- [x] YAML validator (`/yaml`).

## Compliance
- [x] Terms, Privacy, Disclaimer pages.
- [x] Privacy: functional cookie/localStorage list, user rights, contact.
- [x] Security headers (Nitro routeRules): nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy (camera=self), HSTS.
- [ ] Real legal entity name + address + governing-law jurisdiction (owner to provide).
- [ ] Impressum / legal notice — only if targeting Germany.
- [ ] Accessibility statement + audit (nice to have).
- [ ] Content-Security-Policy (needs nonces for inline theme script + JSON-LD).
- [ ] Cookie consent banner — only when analytics/tracking is added.

## Quality
- [x] Unit tests for utils (json-compare, colors, encoding, json-tools) — Vitest, `npm test`.
- [ ] More tests: transform/convert services, share encode/decode, detect.
- [ ] Error monitoring (Sentry), accessibility audit.

## Later
- [ ] Donate button (GitHub Sponsors / Ko-fi / Trakteer) — deferred by owner.
- [ ] Blog / how-to guides for long-tail SEO.
