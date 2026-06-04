-- Stephi Nail it! — initial schema, RLS policies, and storage setup.
--
-- This migration is the source of truth for the database security model.
-- It mirrors what is live on the Supabase project and is safe to run on a
-- fresh project to reproduce the backend.
--
-- SECURITY MODEL (read before changing anything):
--   All database writes happen client-side with the public anon key, so RLS is
--   the ONLY authorization boundary — the Next.js middleware merely hides the
--   admin UI. Every table below has RLS enabled and admin writes gated by
--   is_admin(). Do not add a table without an RLS policy.

-- ---------------------------------------------------------------------------
-- Admin allow-list. A row here = that email may write. The Next.js
-- ADMIN_EMAIL env var gates the UI; this table gates the DATA.
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- is_admin(): true when the signed-in user's JWT email is in public.admins.
--
-- SECURITY DEFINER is required so the function can read public.admins even
-- though the `authenticated` role has no direct SELECT on it (the only policy
-- on admins is itself is_admin()-gated, which would otherwise recurse).
-- `SET search_path = public` is the critical hardening: it prevents a caller
-- from shadowing `admins` via a malicious search_path. The function returns
-- only the caller's OWN admin status, so it is safe to be callable.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- ---------------------------------------------------------------------------
-- Gallery sections (e.g. nails / feet / before-after).
-- ---------------------------------------------------------------------------
create table if not exists public.sections (
  slug       text primary key,
  label      text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Gallery images. storage_path points into the public `gallery` bucket.
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_images (
  id           uuid primary key default gen_random_uuid(),
  section      text not null,
  storage_path text not null,
  alt          text not null default '',
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  width        integer,
  height       integer,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Editable site copy (key -> jsonb value).
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------------------
alter table public.admins         enable row level security;
alter table public.sections       enable row level security;
alter table public.gallery_images enable row level security;
alter table public.site_content   enable row level security;

-- admins: only admins may read; nobody may write via the API.
drop policy if exists "admins admin read" on public.admins;
create policy "admins admin read" on public.admins
  for select to authenticated using (is_admin());

-- sections: world-readable, admin-writable.
drop policy if exists "sections public read" on public.sections;
create policy "sections public read" on public.sections
  for select to public using (true);

drop policy if exists "sections admin write" on public.sections;
create policy "sections admin write" on public.sections
  for all to authenticated using (is_admin()) with check (is_admin());

-- gallery_images: anon sees only published; authenticated admins see all.
drop policy if exists "images anon read published" on public.gallery_images;
create policy "images anon read published" on public.gallery_images
  for select to anon using (is_published);

drop policy if exists "images auth read" on public.gallery_images;
create policy "images auth read" on public.gallery_images
  for select to authenticated using (is_published or is_admin());

drop policy if exists "images admin write" on public.gallery_images;
create policy "images admin write" on public.gallery_images
  for all to authenticated using (is_admin()) with check (is_admin());

-- site_content: world-readable, admin-writable.
drop policy if exists "content public read" on public.site_content;
create policy "content public read" on public.site_content
  for select to public using (true);

drop policy if exists "content admin write" on public.site_content;
create policy "content admin write" on public.site_content
  for all to authenticated using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Storage: public `gallery` bucket. Reads are served by the public CDN
-- (no policy needed for SELECT on a public bucket); writes are admin-only.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = true;

drop policy if exists "gallery admin manage" on storage.objects;
create policy "gallery admin manage" on storage.objects
  for all to authenticated
  using (bucket_id = 'gallery' and is_admin())
  with check (bucket_id = 'gallery' and is_admin());
