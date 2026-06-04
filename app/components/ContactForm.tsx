'use client'

import { useState } from 'react'
import { track } from '@vercel/analytics'

// Real contact form. Submits to Web3Forms, which emails the inquiry to the
// address tied to the access key (stephi_nail_it@gmx.at). The access key is
// public by design and only permits emailing that one fixed address.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [name, setName] = useState('du')
  const [errorMsg, setErrorMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setName(((data.get('name') as string) || '').trim() || 'du')

    if (!ACCESS_KEY) {
      // No email service connected yet — open the visitor's mail app prefilled to Stephi,
      // so the inquiry still reaches her and nothing is lost.
      const body =
        `Name: ${data.get('name') || ''}\n` +
        `Telefon: ${data.get('phone') || ''}\n` +
        `E-Mail: ${data.get('email') || ''}\n` +
        `Wunschleistung: ${data.get('service') || ''}\n` +
        `Wunschtermin: ${data.get('date') || ''}\n\n` +
        `${data.get('message') || ''}`
      window.location.href =
        'mailto:stephi_nail_it@gmx.at?subject=' +
        encodeURIComponent('Terminanfrage – Stephi Nail it!') +
        '&body=' +
        encodeURIComponent(body)
      track('contact_submit', { method: 'mailto' })
      setStatus('success')
      return
    }

    data.append('access_key', ACCESS_KEY)
    data.append('subject', 'Neue Terminanfrage – Stephi Nail it!')
    data.append('from_name', 'Stephi Nail it! Website')

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      const json = await res.json()
      if (json.success) {
        track('contact_submit', { method: 'web3forms' })
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
        setErrorMsg('Senden fehlgeschlagen — bitte ruf an oder schreib per WhatsApp.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Senden fehlgeschlagen — bitte ruf an oder schreib per WhatsApp.')
    }
  }

  return (
    <form className="form" id="contact-form" onSubmit={onSubmit}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="f-name">Name</label>
          <input id="f-name" type="text" name="name" required placeholder="Wie heißt du?" />
        </div>
        <div className="field">
          <label htmlFor="f-phone">Telefon</label>
          <input id="f-phone" type="tel" name="phone" placeholder="+43 …" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="f-email">E-Mail</label>
        <input id="f-email" type="email" name="email" required placeholder="deine@mail.at" />
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="f-service">Wunschleistung</label>
          <select id="f-service" name="service" defaultValue="Nageldesign">
            <option>Nageldesign</option>
            <option>Maniküre</option>
            <option>Smart Pediküre</option>
            <option>EMP Chair Bodywave — Einzelsitzung</option>
            <option>EMP Chair Bodywave — Block</option>
            <option>Beratung</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-date">Wunschtermin</label>
          <input id="f-date" type="date" name="date" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="f-message">Nachricht</label>
        <textarea id="f-message" name="message" placeholder="Erzähl mir kurz, was du dir vorstellst …" />
      </div>

      {/* honeypot — hidden field bots tend to fill in */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />

      <div className={`form-success${status === 'success' ? ' show' : ''}`}>
        Danke, {name} — ich melde mich so schnell wie möglich. ✿
      </div>
      {status === 'error' && (
        <p style={{ color: '#b3261e', fontSize: 13, margin: '8px 0' }}>{errorMsg}</p>
      )}

      <div className="form-submit">
        <p className="privacy">
          Mit dem Absenden stimmst du der Verarbeitung deiner Daten zur Terminanfrage zu.
        </p>
        <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? (
            'Senden …'
          ) : (
            <>
              Anfrage senden <span className="arrow">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
