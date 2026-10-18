import { createPublicClient } from '@/lib/supabase/public'
import { cached } from './cache'
import type { Popup } from '@/types/db'

const getCachedPopups = cached(async () => {
  const { data, error } = await createPublicClient()
    .from('popups')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  if (error) throw error
  return (data as Popup[] | null) ?? []
}, 'popups')

/** החלונות הפעילים. התזמון עצמו (ימים/שעות) נבדק בדפדפן — ראו PopupManager. */
export async function getActivePopups(): Promise<Popup[]> {
  try {
    return await getCachedPopups()
  } catch {
    return []
  }
}
