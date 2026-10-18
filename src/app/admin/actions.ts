'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { CONTENT_TAG } from '@/lib/data/cache'

/**
 * נקרא אחרי כל שמירה בניהול: מנקה את מטמון התוכן הציבורי כך שהשינוי מופיע
 * באתר מיד. רק משתמש מחובר יכול להפעיל — אחרת כל אחד היה יכול לרוקן את המטמון.
 */
export async function publishContent(): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  updateTag(CONTENT_TAG)
  revalidatePath('/', 'layout')
  return { ok: true }
}
