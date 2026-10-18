import { createPublicClient } from '@/lib/supabase/public'
import { cached } from './cache'
import type { Page } from '@/types/db'

export const HOME_SLUG = 'home'

/** כתובות שתפוסות ע"י עמודים קבועים — אי אפשר לתת אותן לעמוד דינמי. */
export const RESERVED_SLUGS = new Set([
  HOME_SLUG,
  'menu',
  'gallery',
  'contact',
  'accessibility',
  'admin',
  'api',
  'icons',
  'icon',
  'apple-icon',
  'opengraph-image',
  'manifest',
  'robots',
  'sitemap',
])

const getCachedPage = cached(async (slug: string) => {
  const { data, error } = await createPublicClient()
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()
  if (error) throw error
  return (data as Page | null) ?? null
}, 'page')

/** null = אין עמוד כזה (או ש-Supabase לא זמין). */
export async function getPage(slug: string): Promise<Page | null> {
  try {
    return await getCachedPage(slug)
  } catch {
    return null
  }
}

const getCachedPublishedPages = cached(async () => {
  const { data, error } = await createPublicClient()
    .from('pages')
    .select('slug, title, updated_at')
    .eq('is_published', true)
    .neq('slug', HOME_SLUG)
  if (error) throw error
  return (data as Pick<Page, 'slug' | 'title' | 'updated_at'>[] | null) ?? []
}, 'published-pages')

export async function getPublishedPages() {
  try {
    return await getCachedPublishedPages()
  } catch {
    return []
  }
}
