import './admin.css'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Server-side gate (defense in depth on top of middleware): only the
// allow-listed admin email may render anything under /admin.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const allow = (process.env.ADMIN_EMAIL ?? '')
    .toLowerCase()
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (!user?.email || !allow.includes(user.email.toLowerCase())) {
    redirect('/auth/login?next=/admin')
  }

  return (
    <div className="admin">
      <header className="admin-header">
        <span className="admin-brand">Stephi Nail it! · Admin</span>
        <nav className="admin-nav">
          <Link href="/admin/gallery">Galerie</Link>
          <Link href="/admin/content">Texte</Link>
          <a href="/" target="_blank" rel="noopener">
            Website ↗
          </a>
        </nav>
        <form action="/auth/signout" method="post" style={{ marginLeft: 'auto' }}>
          <button className="admin-signout" type="submit">
            Abmelden
          </button>
        </form>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  )
}
