// Client-safe helper: build the public CDN URL for a gallery image.
// Uses the NEXT_PUBLIC_ env var so it works in both server and client components.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

export function publicImageUrl(storagePath: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/gallery/${storagePath}`
}
