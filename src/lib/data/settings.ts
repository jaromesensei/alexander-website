import { createClient } from '@/lib/supabase/server'
import { FALLBACK_SETTINGS } from './fallback'
import type { RestaurantSettings } from '@/types/db'

export async function getSettings(): Promise<RestaurantSettings> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('restaurant_settings')
      .select('*')
      .limit(1)
      .maybeSingle()
    if (error || !data) return FALLBACK_SETTINGS
    return data as RestaurantSettings
  } catch {
    return FALLBACK_SETTINGS
  }
}
