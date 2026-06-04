// One-time seed: upload existing photos to Supabase Storage and create
// gallery_images rows mirroring the original site.js category mapping.
// Run with:  node --env-file=.env.local scripts/seed-gallery.mjs
import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}
const supabase = createClient(url, key)
const ASSETS = path.join(process.cwd(), 'public', 'assets')

// --- Mapping (from the original site.js GALLERY object) ---
const FINGER_EXCLUDE = new Set(['n07', 'n08', 'n09', 'n12', 'n13', 'n23', 'n24', 'n28', 'n30'])
const fingerNails = []
for (let i = 3; i <= 31; i++) {
  const id = 'n' + String(i).padStart(2, '0')
  if (!FINGER_EXCLUDE.has(id)) fingerNails.push(`nails/${id}.jpeg`)
}
fingerNails.push('feet/f02.jpeg')

const beforeAfter = []
for (let i = 1; i <= 9; i++) beforeAfter.push(`before-after/ba${String(i).padStart(2, '0')}.jpeg`)

const GALLERY = {
  fingernaegel: fingerNails,
  fussnaegel: ['nails/n13.jpeg', 'nails/n28.jpeg', 'nails/n30.jpeg'],
  pedikuere: ['nails/n07.jpeg', 'nails/n08.jpeg', 'nails/n09.jpeg'],
  vorher_nachher: [
    'feet/f01.jpeg',
    'nails/n02.jpeg',
    'nails/n07.jpeg',
    'nails/n08.jpeg',
    'nails/n09.jpeg',
    'nails/n12.jpeg',
    ...beforeAfter,
  ],
}

// --- 1) Upload each unique file once ---
const uniquePaths = [...new Set(Object.values(GALLERY).flat())]
const uploaded = new Set()
for (const rel of uniquePaths) {
  try {
    const buf = await readFile(path.join(ASSETS, rel))
    const { error } = await supabase.storage
      .from('gallery')
      .upload(rel, buf, { contentType: 'image/jpeg', upsert: false })
    if (error) {
      console.error('UPLOAD FAIL', rel, '-', error.message)
    } else {
      uploaded.add(rel)
      console.log('uploaded', rel)
    }
  } catch (e) {
    console.error('MISSING FILE, skipping', rel, '-', e.message)
  }
}

// --- 2) Insert rows (only for files that uploaded) ---
const rows = []
for (const [section, items] of Object.entries(GALLERY)) {
  let order = 0
  for (const rel of items) {
    if (!uploaded.has(rel)) continue
    rows.push({ section, storage_path: rel, sort_order: order++, is_published: true, alt: '' })
  }
}
const { error, count } = await supabase
  .from('gallery_images')
  .insert(rows, { count: 'exact' })
if (error) {
  console.error('INSERT ROWS FAIL', error.message)
  process.exit(1)
}
console.log(`\nDone. Uploaded ${uploaded.size} files, inserted ${count ?? rows.length} gallery rows.`)
