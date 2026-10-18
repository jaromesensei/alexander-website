import { createClient } from '@/lib/supabase/server'
import { fetchSettings } from './settings'
import { HOME_SLUG } from './pages'
import { FALLBACK_SETTINGS } from './fallback'
import { defaultHomeBlocks } from '@/lib/blocks/defaults'
import { buildLinkOptions } from '@/lib/blocks/linkOptions'
import type { Page } from '@/types/db'

/**
 * נתוני ניהול העמודים — דרך הקליינט המחובר (רואה גם טיוטות), בלי מטמון.
 * missingTable = המיגרציה 0003 עוד לא רצה.
 */
export async function getAdminPagesData() {
  const supabase = await createClient()
  const [settings, pagesResult] = await Promise.all([
    fetchSettings(supabase).catch(() => FALLBACK_SETTINGS),
    supabase.from('pages').select('*').order('created_at'),
  ])

  const all = (pagesResult.data as Page[] | null) ?? []
  const home = all.find((p) => p.slug === HOME_SLUG) ?? null
  const pages = all.filter((p) => p.slug !== HOME_SLUG)
  const homeBlocks = home?.blocks ?? defaultHomeBlocks(settings)

  return {
    settings,
    home,
    pages,
    homeBlocks,
    linkOptions: buildLinkOptions(pages, homeBlocks),
    missingTable: Boolean(pagesResult.error),
  }
}
