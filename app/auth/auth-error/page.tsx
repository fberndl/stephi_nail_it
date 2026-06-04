import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 360 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }}>Anmeldung fehlgeschlagen</h1>
        <p style={{ color: '#6b6360' }}>
          Der Login-Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.
        </p>
        <Link href="/auth/login" style={{ color: '#8E6147' }}>
          Zurück zur Anmeldung
        </Link>
      </div>
    </div>
  )
}
