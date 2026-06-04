Database migrations for the Stephi Nail it! Supabase project.

20260604200000_initial_schema.sql
  Tables (admins, sections, gallery_images, site_content), the is_admin()
  helper, all Row-Level Security policies, and the public `gallery` storage
  bucket + its admin-write policy. This file is the source of truth for the
  security model — RLS is the only thing protecting writes, since the app
  mutates the database client-side with the public anon key.

Applying:
  Run against a project with the Supabase CLI (`supabase db push`) or paste
  into the SQL editor. The script is idempotent (safe to re-run).
