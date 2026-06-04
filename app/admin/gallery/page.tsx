import { createClient } from '@/lib/supabase/server'
import GalleryAdmin from './GalleryAdmin'
import type { GalleryImage, Section } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  // Admin session sees ALL images (published + hidden) via RLS.
  const [sectionsRes, imagesRes] = await Promise.all([
    supabase.from('sections').select('*').order('sort_order'),
    supabase.from('gallery_images').select('*').order('sort_order'),
  ])

  return (
    <GalleryAdmin
      sections={(sectionsRes.data ?? []) as Section[]}
      initialImages={(imagesRes.data ?? []) as GalleryImage[]}
    />
  )
}
