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

## Tools (ideas / backlog)
- [ ] Cron expression parser, SQL formatter, Markdown ↔ HTML + preview
- [ ] Password generator, number base converter (hex/bin/dec)
- [ ] Image tools: compress, image → Base64, favicon generator
- [ ] Lorem ipsum, case / slug converter, YAML validator

## Quality
- [x] Unit tests for utils (json-compare, colors, encoding, json-tools) — Vitest, `npm test`.
- [ ] More tests: transform/convert services, share encode/decode, detect.
- [ ] Error monitoring (Sentry), accessibility audit.

## Later
- [ ] Donate button (GitHub Sponsors / Ko-fi / Trakteer) — deferred by owner.
- [ ] Blog / how-to guides for long-tail SEO.
