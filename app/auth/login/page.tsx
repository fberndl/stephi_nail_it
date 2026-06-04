'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const params = useSearchParams()
  const next = params.get('next') || '/admin'
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        // Admins are a fixed allow-list — never create a new account from this
        // form. Blocks open signup / email-bombing via the public endpoint.
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      setStatus('error')
      setError(error.message)
    } else {
      setStatus('sent')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--bg, #FBF4F1)',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: '#fff',
          borderRadius: 14,
          padding: 36,
          boxShadow: '0 24px 80px rgba(31,31,31,0.12)',
        }}
      >
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, margin: '0 0 4px' }}>
          Admin · Anmelden
        </h1>
        <p style={{ color: '#6b6360', fontSize: 14, marginTop: 0 }}>
          Stephi Nail it! — Galerie &amp; Texte verwalten
        </p>

        {status === 'sent' ? (
          <div style={{ marginTop: 24, lineHeight: 1.6 }}>
            <strong>Fast geschafft!</strong>
            <p style={{ color: '#6b6360', fontSize: 14 }}>
              Wir haben dir einen Login-Link an <strong>{email}</strong> geschickt.
              Öffne die E-Mail und klicke auf den Link, um dich anzumelden.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} style={{ marginTop: 24 }}>
            <label htmlFor="email" style={{ fontSize: 13, fontWeight: 500 }}>
              E-Mail-Adresse
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="du@example.com"
              style={{
                width: '100%',
                marginTop: 6,
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid #e0d8cf',
                fontSize: 15,
                boxSizing: 'border-box',
              }}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                width: '100%',
                marginTop: 16,
                padding: '12px 14px',
                borderRadius: 8,
                border: 0,
                background: '#1f1f1f',
                color: '#fff',
                fontSize: 15,
                cursor: 'pointer',
                opacity: status === 'sending' ? 0.6 : 1,
              }}
            >
              {status === 'sending' ? 'Sende Link …' : 'Login-Link senden'}
            </button>
            {error && (
              <p style={{ color: '#b3261e', fontSize: 13, marginTop: 12 }}>{error}</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
