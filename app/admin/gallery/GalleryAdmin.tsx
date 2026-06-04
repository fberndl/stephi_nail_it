'use client'

import { useMemo, useRef, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createClient } from '@/lib/supabase/client'
import { publicImageUrl } from '@/lib/storage'
import type { GalleryImage, Section } from '@/lib/types'

type CardProps = {
  img: GalleryImage
  sections: Section[]
  onMove: (img: GalleryImage, section: string) => void
  onTogglePublish: (img: GalleryImage) => void
  onDelete: (img: GalleryImage) => void
}

function SortableCard({ img, sections, onMove, onTogglePublish, onDelete }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: img.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 5 : undefined,
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`ph-card${img.is_published ? '' : ' unpublished'}`}
    >
      <div
        className="ph-thumb"
        style={{ backgroundImage: `url('${publicImageUrl(img.storage_path)}')` }}
      >
        <span className="ph-drag" {...attributes} {...listeners} title="Ziehen zum Sortieren">
          ⠿
        </span>
      </div>
      <div className="ph-body">
        <button className="ph-btn pub" onClick={() => onTogglePublish(img)}>
          {img.is_published ? '● sichtbar' : '○ versteckt'}
        </button>
        <select value={img.section} onChange={(e) => onMove(img, e.target.value)}>
          {sections.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.label}
            </option>
          ))}
        </select>
        <div className="ph-row">
          <a
            className="ph-btn"
            href={`${publicImageUrl(img.storage_path)}?download`}
            title="Herunterladen"
          >
            ↓
          </a>
          <button className="ph-btn danger" onClick={() => onDelete(img)}>
            Löschen
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GalleryAdmin({
  sections,
  initialImages,
}: {
  sections: Section[]
  initialImages: GalleryImage[]
}) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages)
  const [activeSection, setActiveSection] = useState(sections[0]?.slug ?? '')
  const [msg, setMsg] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const flash = (m: string) => {
    setMsg(m)
    window.setTimeout(() => setMsg(''), 3000)
  }

  const sectionImages = useMemo(
    () =>
      images
        .filter((i) => i.section === activeSection)
        .sort((a, b) => a.sort_order - b.sort_order),
    [images, activeSection],
  )

  const maxOrder = (section: string) =>
    images
      .filter((i) => i.section === section)
      .reduce((m, i) => Math.max(m, i.sort_order), -1)

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (!list.length) return
    setBusy(true)
    const supabase = createClient()
    let order = maxOrder(activeSection)
    let ok = 0
    for (const file of list) {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `${activeSection}/${crypto.randomUUID()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('gallery')
        .upload(path, file, { contentType: file.type || 'image/jpeg' })
      if (upErr) {
        flash('Upload-Fehler: ' + upErr.message)
        continue
      }
      order += 1
      const { data, error: insErr } = await supabase
        .from('gallery_images')
        .insert({
          section: activeSection,
          storage_path: path,
          sort_order: order,
          is_published: true,
          alt: '',
        })
        .select()
        .single()
      if (insErr) {
        flash('DB-Fehler: ' + insErr.message)
        continue
      }
      setImages((prev) => [...prev, data as GalleryImage])
      ok += 1
    }
    setBusy(false)
    if (ok) flash(`${ok} Bild(er) hochgeladen.`)
  }

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIndex = sectionImages.findIndex((i) => i.id === active.id)
    const newIndex = sectionImages.findIndex((i) => i.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return
    const reordered = arrayMove(sectionImages, oldIndex, newIndex)
    const updates = reordered.map((img, idx) => ({ id: img.id, sort_order: idx }))
    setImages((prev) =>
      prev.map((img) => {
        const u = updates.find((x) => x.id === img.id)
        return u ? { ...img, sort_order: u.sort_order } : img
      }),
    )
    const supabase = createClient()
    const results = await Promise.all(
      updates.map((u) =>
        supabase.from('gallery_images').update({ sort_order: u.sort_order }).eq('id', u.id),
      ),
    )
    if (results.some((r) => r.error)) flash('Reihenfolge nur teilweise gespeichert.')
  }

  async function togglePublish(img: GalleryImage) {
    const next = !img.is_published
    setImages((prev) => prev.map((i) => (i.id === img.id ? { ...i, is_published: next } : i)))
    const supabase = createClient()
    const { error } = await supabase
      .from('gallery_images')
      .update({ is_published: next })
      .eq('id', img.id)
    if (error) flash('Fehler: ' + error.message)
  }

  async function moveSection(img: GalleryImage, newSection: string) {
    if (newSection === img.section) return
    const newOrder = maxOrder(newSection) + 1
    setImages((prev) =>
      prev.map((i) =>
        i.id === img.id ? { ...i, section: newSection, sort_order: newOrder } : i,
      ),
    )
    const supabase = createClient()
    const { error } = await supabase
      .from('gallery_images')
      .update({ section: newSection, sort_order: newOrder })
      .eq('id', img.id)
    flash(error ? 'Fehler: ' + error.message : 'Verschoben.')
  }

  async function remove(img: GalleryImage) {
    if (!window.confirm('Dieses Bild wirklich löschen?')) return
    const supabase = createClient()
    const { error } = await supabase.from('gallery_images').delete().eq('id', img.id)
    if (error) {
      flash('Fehler: ' + error.message)
      return
    }
    // Only delete the stored file if no other row references it.
    const stillUsed = images.some(
      (i) => i.id !== img.id && i.storage_path === img.storage_path,
    )
    if (!stillUsed) await supabase.storage.from('gallery').remove([img.storage_path])
    setImages((prev) => prev.filter((i) => i.id !== img.id))
    flash('Gelöscht.')
  }

  return (
    <div>
      <h1 className="page-title">Galerie verwalten</h1>
      <p className="muted">
        Bilder hochladen, per Drag &amp; Drop sortieren, Kategorie ändern,
        ein-/ausblenden, herunterladen oder löschen.
      </p>

      <div className="admin-tabs">
        {sections.map((s) => (
          <button
            key={s.slug}
            className={`admin-tab${s.slug === activeSection ? ' active' : ''}`}
            onClick={() => setActiveSection(s.slug)}
          >
            {s.label} ({images.filter((i) => i.section === s.slug).length})
          </button>
        ))}
      </div>

      <div
        className={`dropzone${dragOver ? ' drag' : ''}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
      >
        {busy ? (
          <strong>Lade hoch …</strong>
        ) : (
          <>
            <strong>Bilder hierher ziehen</strong> oder klicken zum Auswählen
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={sectionImages.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="admin-grid">
            {sectionImages.map((img) => (
              <SortableCard
                key={img.id}
                img={img}
                sections={sections}
                onMove={moveSection}
                onTogglePublish={togglePublish}
                onDelete={remove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sectionImages.length === 0 && (
        <p className="muted" style={{ marginTop: 20 }}>
          Noch keine Bilder in dieser Kategorie.
        </p>
      )}

      {msg && <div className="admin-msg">{msg}</div>}
    </div>
  )
}
