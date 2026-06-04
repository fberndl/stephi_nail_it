# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] — 2026-06-04

Initial public release. `sni-2026.06.04`

### Added
- **Public website** — single-page Next.js 15 (App Router, React 19, TypeScript)
  site for the Stephi Nail it! nail studio: hero, services, gallery, FAQ, and a
  contact form.
- **Supabase-backed gallery & content** — `sections`, `gallery_images`, and
  `site_content` tables read by the public site; admin writes go through the
  browser client gated by Row-Level Security.
- **Admin CMS** (`/admin`) — magic-link login (allow-listed emails), photo
  manager (upload, drag-reorder, sections, publish, delete) and editable site
  texts.
- **Contact form** — emails inquiries via Web3Forms, with a `mailto:` fallback
  and a bot honeypot.
- **SEO & structured data** — `NailSalon` + `FAQPage` JSON-LD generated from the
  live CMS content, sitemap, robots, OpenGraph/Twitter metadata, and a hidden
  build-version marker.
- **Analytics** — Vercel Web Analytics (cookieless).

### Security
- Row-Level Security on every table; admin writes gated by an `is_admin()`
  function hardened with a fixed `search_path`. Policies are versioned in
  `supabase/migrations/`.
- Open sign-up disabled both in app code (`shouldCreateUser: false`) and at the
  Supabase Auth project level.
- JSON-LD output escapes `<` to prevent script-tag breakout.
- GitHub secret scanning, push protection, and Dependabot enabled; `postcss`
  pinned to a patched version.

### Infrastructure
- Deployed on Vercel with GitHub auto-deploy; Supabase connected via GitHub for
  migration sync.
- CI runs ESLint + TypeScript type-checking on every push and pull request.

[1.0.0]: https://github.com/fberndl/stephi_nail_it/releases/tag/v1.0.0
