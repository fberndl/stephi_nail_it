import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SITE_URL, BUSINESS } from '@/lib/site'
import './globals.css'

const OG_DESCRIPTION =
  'Nageldesign · Smart Pediküre · EMP Chair Bodywave · Wien Floridsdorf'

// Hidden build marker — not visible to visitors, but present in the page
// source as <meta name="version" ...>. Lets us confirm which build is live
// (e.g. `curl -s … | grep 'name="version"'`). Bump on notable releases.
const APP_VERSION = 'sni-2026.06.04'

export const metadata: Metadata = {
  // Resolves all relative URLs (canonical, OG/Twitter images) to absolute.
  metadataBase: new URL(SITE_URL),
  title: 'Stephi Nail it! · Nageldesign · Smart Pediküre · Wien Floridsdorf',
  description: BUSINESS.description,
  alternates: { canonical: '/' },
  icons: { icon: '/assets/logo.svg' },
  openGraph: {
    title: 'Stephi Nail it! — Beauty inside and outside',
    description: OG_DESCRIPTION,
    type: 'website',
    locale: 'de_AT',
    siteName: BUSINESS.name,
    url: SITE_URL,
    images: [
      {
        url: BUSINESS.ogImage,
        alt: 'Stephi Nail it! — Nagelstudio in Wien Floridsdorf',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stephi Nail it! — Beauty inside and outside',
    description: OG_DESCRIPTION,
    images: [BUSINESS.ogImage],
  },
  // Set GOOGLE_SITE_VERIFICATION in the env to verify Google Search Console.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  // Hidden version marker (renders <meta name="version" content="…">).
  other: { version: APP_VERSION },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>
        {/* React 19 hoists these into <head> */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/print.css" media="print" />
        {children}
        {/* Cookieless, GDPR-friendly — inert unless deployed on Vercel. */}
        <Analytics />
      </body>
    </html>
  )
}
