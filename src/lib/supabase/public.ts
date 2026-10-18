import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/db'

/**
 * קליינט anon בלי עוגיות — לקריאת תוכן ציבורי בלבד. בלי cookies() העמודים
 * הציבוריים נבנים סטטית ונשמרים במטמון, ומתעדכנים רק כשנשמר שינוי בניהול.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase is not configured')
  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export type DbClient = ReturnType<typeof createPublicClient>
