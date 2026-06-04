import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Handles the magic-link redirect: exchanges the code for a session, then
// forwards to the originally requested page (default /admin).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-error`)
}
