'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { HoursDay, SiteContentData } from '@/lib/content'

export default function ContentAdmin({ initial }: { initial: SiteContentData }) {
  const [data, setData] = useState<SiteContentData>(initial)
  const [msg, setMsg] = useState('')

  const flash = (m: string) => {
    setMsg(m)
    window.setTimeout(() => setMsg(''), 3000)
  }

  async function save<K extends keyof SiteContentData>(key: K) {
    const supabase = createClient()
    const { error } = await supabase
      .from('site_content')
      .upsert({ key, value: data[key], updated_at: new Date().toISOString() })
    flash(error ? 'Fehler: ' + error.message : 'Gespeichert ✓')
  }

  function updateDay(i: number, patch: Partial<HoursDay>) {
    setData((d) => ({
      ...d,
      hours: { days: d.hours.days.map((day, idx) => (idx === i ? { ...day, ...patch } : day)) },
    }))
  }
  function setEmp(patch: Partial<SiteContentData['emp_prices']>) {
    setData((d) => ({ ...d, emp_prices: { ...d.emp_prices, ...patch } }))
  }

  return (
    <div>
      <h1 className="page-title">Texte verwalten</h1>
      <p className="muted">Änderungen erscheinen sofort auf der Website.</p>

      <div className="content-card" style={{ marginTop: 22 }}>
        <h2>Über mich</h2>
        <label>Vorstellungstext</label>
        <textarea
          rows={5}
          value={data.about.paragraph}
          onChange={(e) => setData({ ...data, about: { paragraph: e.target.value } })}
        />
        <button className="save" onClick={() => save('about')}>
          Speichern
        </button>
      </div>

      <div className="content-card">
        <h2>Öffnungszeiten</h2>
        {data.hours.days.map((d, i) => (
          <div className="hours-row" key={i}>
            <input value={d.name} onChange={(e) => updateDay(i, { name: e.target.value })} />
            <input value={d.time} onChange={(e) => updateDay(i, { time: e.target.value })} />
            <label style={{ display: 'flex', gap: 6, alignItems: 'center', margin: 0 }}>
              <input
                type="checkbox"
                style={{ width: 'auto' }}
                checked={!!d.closed}
                onChange={(e) => updateDay(i, { closed: e.target.checked })}
              />{' '}
              zu
            </label>
          </div>
        ))}
        <button className="save" onClick={() => save('hours')}>
          Speichern
        </button>
      </div>

      <div className="content-card">
        <h2>EMP Chair — Preise</h2>
        <div className="price-grid">
          <div>
            <label>Einzelsitzung</label>
            <input value={data.emp_prices.single} onChange={(e) => setEmp({ single: e.target.value })} />
          </div>
          <div>
            <label>Einzelsitzung (durchgestrichen)</label>
            <input value={data.emp_prices.singleOld} onChange={(e) => setEmp({ singleOld: e.target.value })} />
          </div>
          <div>
            <label>8er Block</label>
            <input value={data.emp_prices.block8} onChange={(e) => setEmp({ block8: e.target.value })} />
          </div>
          <div>
            <label>10er Block</label>
            <input value={data.emp_prices.block10} onChange={(e) => setEmp({ block10: e.target.value })} />
          </div>
          <div>
            <label>16er Block</label>
            <input value={data.emp_prices.block16} onChange={(e) => setEmp({ block16: e.target.value })} />
          </div>
        </div>
        <button className="save" onClick={() => save('emp_prices')}>
          Speichern
        </button>
      </div>

      <div className="content-card">
        <h2>Aktions-Banner</h2>
        <div className="price-grid">
          <div>
            <label>Aktionspreis</label>
            <input
              value={data.promo.price}
              onChange={(e) => setData({ ...data, promo: { ...data.promo, price: e.target.value } })}
            />
          </div>
          <div>
            <label>Alter Preis (durchgestrichen)</label>
            <input
              value={data.promo.oldPrice}
              onChange={(e) => setData({ ...data, promo: { ...data.promo, oldPrice: e.target.value } })}
            />
          </div>
        </div>
        <button className="save" onClick={() => save('promo')}>
          Speichern
        </button>
      </div>

      {msg && <div className="admin-msg">{msg}</div>}
    </div>
  )
}
