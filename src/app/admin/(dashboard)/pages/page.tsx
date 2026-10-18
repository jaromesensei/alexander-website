import { getAdminPagesData } from '@/lib/data/adminPages'
import { getNav } from '@/lib/links'
import { PagesAdminClient } from '@/components/admin/PagesAdminClient'
import { NavEditor } from '@/components/admin/NavEditor'

export default async function AdminPagesPage() {
  const { settings, pages, linkOptions, missingTable } = await getAdminPagesData()

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">עמודים וניווט</h1>
        <p className="text-ink-soft">
          עריכה ויזואלית של עמוד הבית, יצירת עמודים חדשים וסידור התפריט העליון.
        </p>
      </div>

      {missingTable && (
        <div className="bg-mustard/30 border-mustard mb-6 rounded-2xl border p-4 text-sm">
          כדי לשמור עמודים צריך להריץ פעם אחת ב-Supabase את הקובץ{' '}
          <code dir="ltr">supabase/migrations/0003_pages_and_nav.sql</code> (SQL Editor →
          הדבקה → Run).
        </div>
      )}

      <PagesAdminClient pages={pages} />
      <NavEditor
        settingsId={settings.id}
        initial={getNav(settings)}
        linkOptions={linkOptions}
      />
    </div>
  )
}
