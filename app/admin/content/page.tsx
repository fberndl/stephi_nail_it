import { createClient } from '@/lib/supabase/server'
import { mergeContent } from '@/lib/content'
import ContentAdmin from './ContentAdmin'

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_content').select('*')
  const stored: Record<string, Record<string, unknown>> = {}
  for (const row of (data ?? []) as { key: string; value: Record<string, unknown> }[]) {
    stored[row.key] = row.value
  }
  return <ContentAdmin initial={mergeContent(stored)} />
}
