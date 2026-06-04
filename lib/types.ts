// Shared types mirroring the Supabase schema.

export type Section = {
  slug: string
  label: string
  sort_order: number
}

export type GalleryImage = {
  id: string
  section: string
  storage_path: string
  alt: string
  sort_order: number
  is_published: boolean
  width: number | null
  height: number | null
  created_at: string
}

// site_content rows are key -> arbitrary JSON value.
export type SiteContent = {
  key: string
  value: Record<string, unknown>
  updated_at: string
}

// A section bundled with its (published) images, for rendering the gallery.
export type SectionWithImages = Section & { items: GalleryImage[] }
