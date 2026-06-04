import Link from 'next/link'

// Shared chrome for the legal pages (Impressum / AGB / Datenschutz).
export default function LegalPage({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <Link href="/" className="legal-logo">
          <img src="/assets/logo.svg" alt="Stephi Nail it!" />
        </Link>
        <Link href="/" className="legal-back">
          ← Zurück zur Website
        </Link>
      </header>
      <main className="legal">
        <h1 className="serif">{title}</h1>
        {children}
      </main>
      <footer className="legal-footer">
        <Link href="/impressum">Impressum</Link>
        <Link href="/agb">AGB</Link>
        <Link href="/datenschutz">Datenschutz</Link>
      </footer>
    </div>
  )
}
