import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Public, indexable routes. Admin/auth pages are intentionally excluded.
const ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/impressum', priority: 0.3 },
  { path: '/agb', priority: 0.3 },
  { path: '/datenschutz', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === '/' ? 'weekly' : 'yearly',
    priority,
  }))
}
