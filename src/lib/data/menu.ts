import { createClient } from '@/lib/supabase/server'
import { FALLBACK_CATEGORIES } from './fallback'
import type { MenuCategory, MenuItem } from '@/types/db'

export type CategoryWithItems = MenuCategory & { items: MenuItem[] }

export async function getMenu(): Promise<CategoryWithItems[]> {
  try {
    const supabase = await createClient()
    const [{ data: categories, error: catErr }, { data: items, error: itemErr }] =
      await Promise.all([
        supabase
          .from('menu_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order'),
        supabase
          .from('menu_items')
          .select('*')
          .eq('is_available', true)
          .order('sort_order'),
      ])

    if (catErr || itemErr || !categories || categories.length === 0) {
      return FALLBACK_CATEGORIES
    }

    return (categories as MenuCategory[]).map((category) => ({
      ...category,
      items:
        (items as MenuItem[] | null)?.filter((i) => i.category_id === category.id) ?? [],
    }))
  } catch {
    return FALLBACK_CATEGORIES
  }
}
