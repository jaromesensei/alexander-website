import { createPublicClient, type DbClient } from '@/lib/supabase/public'
import { cached } from './cache'
import { FALLBACK_CATEGORIES } from './fallback'
import type { MenuCategory, MenuItem } from '@/types/db'

export type CategoryWithItems = MenuCategory & { items: MenuItem[] }

/** publicOnly=false מחזיר גם קטגוריות מוסתרות ומנות לא זמינות (לניהול). */
export async function fetchMenu(
  supabase: DbClient,
  publicOnly = true,
): Promise<CategoryWithItems[]> {
  let categoriesQuery = supabase.from('menu_categories').select('*').order('sort_order')
  let itemsQuery = supabase.from('menu_items').select('*').order('sort_order')
  if (publicOnly) {
    categoriesQuery = categoriesQuery.eq('is_active', true)
    itemsQuery = itemsQuery.eq('is_available', true)
  }
  const [{ data: categories, error: catErr }, { data: items, error: itemErr }] =
    await Promise.all([categoriesQuery, itemsQuery])
  if (catErr) throw catErr
  if (itemErr) throw itemErr

  return ((categories as MenuCategory[] | null) ?? []).map((category) => ({
    ...category,
    items: ((items as MenuItem[] | null) ?? []).filter(
      (i) => i.category_id === category.id,
    ),
  }))
}

const getCachedMenu = cached(() => fetchMenu(createPublicClient()), 'menu')

export async function getMenu(): Promise<CategoryWithItems[]> {
  try {
    const menu = await getCachedMenu()
    return menu.length > 0 ? menu : FALLBACK_CATEGORIES
  } catch {
    return FALLBACK_CATEGORIES
  }
}
