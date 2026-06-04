# Stephi Nail it!

[![CI](https://github.com/fberndl/stephi_nail_it/actions/workflows/ci.yml/badge.svg)](https://github.com/fberndl/stephi_nail_it/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20·%20Auth%20·%20Storage-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)](https://stephi-nail-it.vercel.app)
[![Code license: MIT](https://img.shields.io/badge/code-MIT-yellow.svg)](./LICENSE)

Marketing website and content-management backend for the **Stephi Nail it!**
nail studio (Vienna). A single-page public site presents the studio, services,
and a photo gallery; a password-less admin area lets the owner manage the
gallery and editable page texts without touching code.

## Stack

- **[Next.js 15](https://nextjs.org/)** (App Router, React 19, TypeScript)
- **[Supabase](https://supabase.com/)** — Postgres + Auth (magic-link OTP) + Storage
- **[@supabase/ssr](https://github.com/supabase/auth-helpers)** for cookie-based sessions
- **[@dnd-kit](https://dndkit.com/)** for drag-and-drop gallery ordering
- Deployed on **Vercel**

## How it works

The public pages (`/`, `/impressum`, `/datenschutz`, `/agb`) read published
content and images directly from Supabase. The admin area under `/admin` is
gated two ways:

1. **`middleware.ts`** redirects non-admins away from `/admin/*`.
2. **`app/admin/layout.tsx`** repeats the check server-side (defense in depth).

Both compare the signed-in user's email against the `ADMIN_EMAIL` allow-list.

> **Security note:** all database writes happen client-side with the public
> Supabase anon key, so the real authorization boundary is **Row-Level
> Security (RLS)** in Postgres, *not* the middleware. The middleware only hides
> the admin UI. Never rely on it alone to protect data — RLS must be enabled and
> correct on every table. See `supabase/migrations/` for the schema and policies.

### Contact form

The contact form emails inquiries to the studio's contact email via
[Web3Forms](https://web3forms.com). Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` to a
free key claimed for that address (web3forms.com → enter the email → the key is
mailed to it). **Until a key is set**, submitting falls back to opening the
visitor's own mail app pre-filled, so inquiries still reach the studio.

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
#    then fill in the values from your Supabase project
#    (Dashboard → Project Settings → API)

# 3. Run the dev server
npm run dev          # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key (public; RLS does the gating) |
| `ADMIN_EMAIL` | Comma-separated allow-list of emails permitted into `/admin` |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | **Needed for the contact form to email inquiries.** Free key from [web3forms.com](https://web3forms.com) claimed for the studio's email address. If unset, the form falls back to opening the visitor's mail app (pre-filled). |
| `NEXT_PUBLIC_SITE_URL` | Base URL used for magic-link redirects |

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (next/core-web-vitals)
```

## Project structure

```
app/
  page.tsx          # public single-page site
  impressum/        # legal pages (Impressum, Datenschutz, AGB)
  datenschutz/
  agb/
  admin/            # owner CMS — gallery & text editing (allow-list gated)
  auth/             # magic-link login, callback, signout
  components/       # shared UI (Gallery, LegalPage, …)
lib/
  supabase/         # browser / server / middleware Supabase clients
  gallery.ts        # gallery data access
  content.ts        # editable site-content data access
  storage.ts        # public image URL helper
supabase/
  migrations/       # database schema + RLS policies
public/assets/      # site imagery
```

## Deployment

Connect the repo to Vercel and set the environment variables above in the
project settings. Add the deployed URL (and `…/auth/callback`) to the Supabase
**Auth → URL Configuration** redirect allow-list so magic links resolve.

## License

- **Source code** — [MIT](./LICENSE), free to reuse with attribution.
- **Content & brand** — all photographs, images, logos, the "Stephi Nail it!"
  name, and the website's written copy are © **Stephi Nail it!**, all rights
  reserved, and are **not** covered by the MIT license. See [NOTICE](./NOTICE).

If you fork this repository, replace the content under `public/assets/` and
the site copy with your own.
