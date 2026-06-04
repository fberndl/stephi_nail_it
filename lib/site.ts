// Single source of truth for the public site URL and the studio's "NAP"
// (Name / Address / Phone) facts. Shared by metadata (layout.tsx),
// sitemap/robots, and the JSON-LD structured data so the canonical URL and
// business details can never drift apart.

// Default to this project's Vercel domain. In production set
// NEXT_PUBLIC_SITE_URL to the real domain — it drives canonical URLs, the
// sitemap, OpenGraph image URLs AND the Supabase magic-link redirect.
const FALLBACK_URL = 'https://stephi-nail-it.vercel.app'

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  // Ignore localhost so a forgotten env var can never emit localhost
  // canonicals or OpenGraph URLs into a production build.
  if (!raw || raw.includes('localhost') || raw.includes('127.0.0.1')) {
    return FALLBACK_URL
  }
  return raw.replace(/\/+$/, '')
}

export const SITE_URL = resolveSiteUrl()

// Absolute URL helper for assets that must be fully-qualified (OG images, JSON-LD).
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

export const BUSINESS = {
  name: 'Stephi Nail it!',
  // Short, human description reused in metadata + structured data.
  description:
    'Modernes Nagelstudio in Wien Floridsdorf. Nageldesign, Smart Pediküre und EMP Chair Bodywave — sanfte Pflege, moderne Technik, Zeit nur für dich.',
  // E.164 international form of the displayed 0677 62815410.
  phone: '+4367762815410',
  email: 'stephi_nail_it@gmx.at',
  address: {
    street: 'Schloßhoferstraße 24/3',
    postalCode: '1210',
    city: 'Wien',
    country: 'AT',
  },
  // Approximate coordinates of the studio (from the Google Maps embed).
  geo: { latitude: 48.2563995, longitude: 16.402229 },
  priceRange: '€€',
  instagram: 'https://instagram.com/stephi_nail_it',
  // Google Maps place link (same place id used by the "write a review" CTA).
  googleMaps:
    'https://www.google.com/maps/search/?api=1&query=Stephi+nail+it%2C+Schlo%C3%9Fhoferstra%C3%9Fe+24%2C+1210+Wien',
  // Primary share/preview image (a real photo beats a logo on social cards).
  ogImage: '/assets/nails/n22.jpeg',
} as const
