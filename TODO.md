# Next TODO

Deferred items to pick up later (not done yet).

## Growth & measurement (deferred)
- [ ] **Analytics** — privacy-friendly (Vercel Analytics / Plausible / Umami) to
      measure page views, top pages and referrers. _(explicitly deferred)_
- [ ] **Google Search Console** — add verification meta + submit `/sitemap.xml`.
- [ ] **Prerender** static pages (nuxt `routeRules` `prerender: true`) for
      landing / about / legal pages — faster + better SEO.
- [ ] **Per-page OG images** (currently all pages share one `/og-image.png`).

## i18n — remaining
- [x] All tool pages + chrome localized in en/id/ms/fil/vi.
- [ ] Deep qr-generator form-field labels (SSID, Subject, Bar width, …).
- [ ] Localize generated content: JSON Compare conclusions, landing page
      titles/FAQ, and the legal pages (terms/privacy/disclaimer) full text.

## Tools — planned next (prioritised)
- [ ] **JSON → Go / Python / Java / C# / Kotlin** — extend the JSON→TypeScript engine to more target languages.
- [ ] **Mock / fake data generator** — names, emails, addresses, dates, UUIDs; output JSON/CSV/SQL insert, choose row count.
- [x] **Text utilities** (`/text-tools`) — counts, sort/dedupe/reverse/trim lines, case, find & replace.
- [ ] **CSS generators** — box-shadow, gradient, border-radius, cubic-bezier (visual, shareable).
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
