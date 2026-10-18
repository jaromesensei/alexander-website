import { createPublicClient, type DbClient } from '@/lib/supabase/public'
import { cached } from './cache'
import { FALLBACK_SETTINGS } from './fallback'
import type { RestaurantSettings } from '@/types/db'

export async function fetchSettings(supabase: DbClient): Promise<RestaurantSettings> {
  const { data, error } = await supabase
    .from('restaurant_settings')
    .select('*')
    .limit(1)
    .maybeSingle()
  if (error) throw error
  if (!data) return FALLBACK_SETTINGS
  return { ...FALLBACK_SETTINGS, ...data } as RestaurantSettings
}

const getCachedSettings = cached(() => fetchSettings(createPublicClient()), 'settings')

export async function getSettings(): Promise<RestaurantSettings> {
  try {
    return await getCachedSettings()
  } catch {
    return FALLBACK_SETTINGS
  }
}
