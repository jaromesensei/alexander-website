import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAdminPagesData } from '@/lib/data/adminPages'
import { PopupEditor } from '@/components/admin/popups/PopupEditor'
import type { Popup } from '@/types/db'

export default async function AdminPopupEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data }, { settings, linkOptions }] = await Promise.all([
    supabase.from('popups').select('*').eq('id', id).maybeSingle(),
    getAdminPagesData(),
  ])
  if (!data) notFound()

  const popup = data as Popup
  // Postgres מחזיר 'HH:MM:SS'; שדה time בדפדפן עובד עם 'HH:MM'
  const initial: Popup = {
    ...popup,
    start_time: popup.start_time?.slice(0, 5) ?? null,
    end_time: popup.end_time?.slice(0, 5) ?? null,
  }

  return (
    <PopupEditor
      key={id}
      initial={initial}
      settings={settings}
      linkOptions={linkOptions}
    />
  )
}
