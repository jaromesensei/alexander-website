import { createClient } from '@/lib/supabase/server'
import { fetchMenu } from '@/lib/data/menu'
import { MenuAdminClient } from '@/components/admin/MenuAdminClient'

export default async function AdminMenuPage() {
  const categories = await fetchMenu(await createClient(), false)

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
