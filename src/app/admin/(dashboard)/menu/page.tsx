import { createClient } from '@/lib/supabase/server'
import { MenuAdminClient } from '@/components/admin/MenuAdminClient'
import type { MenuCategory, MenuItem } from '@/types/db'
import type { CategoryWithItems } from '@/lib/data/menu'

async function getAdminMenu(): Promise<CategoryWithItems[]> {
  const supabase = await createClient()
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from('menu_categories').select('*').order('sort_order'),
    supabase.from('menu_items').select('*').order('sort_order'),
  ])

  return ((categories as MenuCategory[]) ?? []).map((category) => ({
    ...category,
    items:
      (items as MenuItem[] | null)?.filter((i) => i.category_id === category.id) ?? [],
  }))
}

export default async function AdminMenuPage() {
  const categories = await getAdminMenu()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">ניהול תפריט</h1>
        <p className="text-ink-soft">
          עדכונים כאן מופיעים באתר הציבורי מיידית, כולל תרגום אוטומטי לכל שפה.
        </p>
      </div>
      <MenuAdminClient categories={categories} />
    </div>
  )
}
