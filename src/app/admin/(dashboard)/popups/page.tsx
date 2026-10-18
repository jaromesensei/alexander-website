import { createClient } from '@/lib/supabase/server'
import { PopupsAdminClient } from '@/components/admin/popups/PopupsAdminClient'
import { describeSchedule, popupStatus, zonedNow } from '@/lib/popups/schedule'
import type { Popup } from '@/types/db'

export default async function AdminPopupsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('popups').select('*').order('sort_order')
  const now = zonedNow()
  const popups = ((data as Popup[] | null) ?? []).map((p) => ({
    ...p,
    status: popupStatus(p, now),
    schedule: describeSchedule(p),
  }))

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">חלונות קופצים</h1>
        <p className="text-ink-soft">
          מבצעים שקופצים כשנכנסים לאתר. לכל חלון ימים, שעות ותאריכים משלו — הוא נדלק ונכבה
          לבד.
        </p>
      </div>

      {error && (
        <div className="bg-mustard/30 border-mustard mb-6 rounded-2xl border p-4 text-sm">
          כדי להשתמש בחלונות קופצים צריך להריץ פעם אחת ב-Supabase את הקובץ{' '}
          <code dir="ltr">supabase/migrations/0004_popups.sql</code> (SQL Editor → הדבקה →
          Run).
        </div>
      )}

      <PopupsAdminClient popups={popups} />
    </div>
  )
}
