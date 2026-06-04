'use client'

import { useEffect, useState } from 'react'
import type { SectionWithImages } from '@/lib/types'
import { publicImageUrl } from '@/lib/storage'

// Data-driven replacement for the original hardcoded GALLERY object in site.js.
// Tabs + grid + lightbox, matching the original markup/classNames so styles.css applies.
export default function Gallery({ sections }: { sections: SectionWithImages[] }) {
  const firstWithItems =
    sections.find((s) => s.items.length > 0)?.slug ?? sections[0]?.slug ?? ''
  const [tab, setTab] = useState(firstWithItems)
  const [lbIndex, setLbIndex] = useState<number | null>(null)

  const current = sections.find((s) => s.slug === tab) ?? sections[0]
  const items = current?.items ?? []

  useEffect(() => {
    if (lbIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLbIndex(null)
      if (e.key === 'ArrowLeft')
        setLbIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length))
      if (e.key === 'ArrowRight')
        setLbIndex((i) => (i === null ? i : (i + 1) % items.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lbIndex, items.length])

  return (
    <>
      <div className="gallery-tabs reveal in">
        {sections.map((s) => (
          <button
            key={s.slug}
            className={`gallery-tab${s.slug === tab ? ' active' : ''}`}
            onClick={() => {
              setTab(s.slug)
              setLbIndex(null)
            }}
          >
            {s.label} <span className="count">— {s.items.length}</span>
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {items.map((item, i) => (
          <div className="gallery-item" key={item.id} onClick={() => setLbIndex(i)}>
            {/* plain img keeps the exact original layout; remote CDN URL from Supabase */}
            <img
              src={publicImageUrl(item.storage_path)}
              alt={item.alt || `${current?.label} ${i + 1}`}
              loading="lazy"
            />
            <div className="label">
              {current?.label} · {String(i + 1).padStart(2, '0')}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p style={{ color: 'var(--ink-soft)', gridColumn: '1 / -1' }}>
            Bald verfügbar — Fotos folgen in Kürze.
          </p>
        )}
      </div>

      <div
        className={`lightbox${lbIndex !== null ? ' open' : ''}`}
        onClick={() => setLbIndex(null)}
      >
        {lbIndex !== null && items[lbIndex] && (
          <>
            <img
              id="lightbox-img"
              src={publicImageUrl(items[lbIndex].storage_path)}
              alt={items[lbIndex].alt || ''}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="lightbox-close"
              onClick={(e) => {
                e.stopPropagation()
                setLbIndex(null)
              }}
              aria-label="Schließen"
            >
              ✕
            </button>
            <button
              className="lightbox-nav prev"
              onClick={(e) => {
                e.stopPropagation()
                setLbIndex((lbIndex - 1 + items.length) % items.length)
              }}
              aria-label="Vorheriges Bild"
            >
              ‹
            </button>
            <button
              className="lightbox-nav next"
              onClick={(e) => {
                e.stopPropagation()
                setLbIndex((lbIndex + 1) % items.length)
              }}
              aria-label="Nächstes Bild"
            >
              ›
            </button>
            <div className="lightbox-counter">
              {lbIndex + 1} / {items.length}
            </div>
          </>
        )}
      </div>
    </>
  )
}
