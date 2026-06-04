import { createClient } from '@/lib/supabase/server'
import type { GalleryImage, Section, SectionWithImages } from '@/lib/types'

// Fetch all sections with their published images, grouped and ordered.
// Runs on the server (anon RLS already restricts to published rows).
export async function getGallery(): Promise<SectionWithImages[]> {
  const supabase = await createClient()
  const [sectionsRes, imagesRes] = await Promise.all([
    supabase.from('sections').select('*').order('sort_order'),
    supabase
      .from('gallery_images')
      .select('*')
      .eq('is_published', true)
      .order('sort_order'),
  ])

  const sections = (sectionsRes.data ?? []) as Section[]
  const images = (imagesRes.data ?? []) as GalleryImage[]

  const bySection = new Map<string, GalleryImage[]>()
  for (const img of images) {
    const arr = bySection.get(img.section) ?? []
    arr.push(img)
    bySection.set(img.section, arr)
  }

  return sections.map((s) => ({ ...s, items: bySection.get(s.slug) ?? [] }))
}

// Fetch editable text content as a key -> value map.
export async function getSiteContent(): Promise<Record<string, Record<string, unknown>>> {
  const supabase = await createClient()
  const { data } = await supabase.from('site_content').select('*')
  const map: Record<string, Record<string, unknown>> = {}
  for (const row of data ?? []) {
    map[(row as { key: string }).key] = (row as { value: Record<string, unknown> }).value
  }
  return map
}
