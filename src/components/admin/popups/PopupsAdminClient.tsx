'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CalendarClock, Copy, Pencil, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { publishContent } from '@/app/admin/actions'
import { cn } from '@/lib/utils'
import type { PopupStatus } from '@/lib/popups/schedule'
import type { Popup } from '@/types/db'

type Row = Popup & { status: PopupStatus; schedule: string }

export const STATUS_LABEL: Record<PopupStatus, { text: string; className: string }> = {
  live: { text: 'מוצג עכשיו', className: 'bg-turquoise/30 text-ink' },
  scheduled: { text: 'מתוזמן', className: 'bg-mustard/30 text-ink' },
  ended: { text: 'הסתיים', className: 'bg-paper-dark text-ink-soft' },
  off: { text: 'כבוי', className: 'bg-paper-dark text-ink-soft' },
}

const NEW_POPUP = {
  name: 'חלון חדש',
  heading: 'כותרת המבצע',
  body: 'פרטי המבצע בקצרה.',
  button: { label: 'הזמנת שולחן', href: 'wa:reservation' },
  is_active: false,
}

export function PopupsAdminClient({ popups }: { popups: Row[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function create(from?: Popup) {
    setBusy(true)
    setError(null)
    const payload: Record<string, unknown> = from
      ? {
          name: `${from.name} (עותק)`,
          heading: from.heading,
          body: from.body,
          image_url: from.image_url,
          button: from.button,
          bg: from.bg,
          days: from.days,
          start_time: from.start_time,
          end_time: from.end_time,
          start_date: from.start_date,
          end_date: from.end_date,
          frequency: from.frequency,
          delay_seconds: from.delay_seconds,
          placement: from.placement,
          sort_order: popups.length,
          is_active: false,
        }
      : { ...NEW_POPUP, sort_order: popups.length }
    const { data, error: insertError } = await createClient()
      .from('popups')
      .insert(payload)
      .select('id')
      .single()
    setBusy(false)
    if (insertError || !data) {
      setError('היצירה נכשלה. האם המיגרציה 0004 הורצה ב-Supabase?')
      return
    }
    router.push(`/admin/popups/${data.id}`)
  }

  async function toggle(p: Row) {
    await createClient()
      .from('popups')
      .update({ is_active: !p.is_active, updated_at: new Date().toISOString() })
      .eq('id', p.id)
    await publishContent()
  }

  async function remove(p: Row) {
    if (!confirm(`למחוק את "${p.name}"?`)) return
    await createClient().from('popups').delete().eq('id', p.id)
    await publishContent()
  }

  return (
    <div>
      {popups.length > 0 && (
        <ul className="border-ink/10 divide-ink/10 mb-3 divide-y rounded-2xl border bg-white">
          {popups.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 p-3">
              <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={p.is_active}
                  onChange={() => toggle(p)}
                  className="peer sr-only"
                  aria-label={p.is_active ? 'כיבוי' : 'הפעלה'}
                />
                <span className="bg-ink/20 peer-checked:bg-turquoise peer-focus-visible:outline-pink h-6 w-11 rounded-full transition-colors peer-focus-visible:outline-2" />
                <span className="absolute start-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:-translate-x-5" />
              </label>
              <Link href={`/admin/popups/${p.id}`} className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{p.name}</span>
                <span className="text-ink-soft flex items-center gap-1 text-xs">
                  <CalendarClock className="size-3.5 shrink-0" />
                  <span className="truncate">{p.schedule}</span>
                </span>
              </Link>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
                  STATUS_LABEL[p.status].className,
                )}
              >
                {STATUS_LABEL[p.status].text}
              </span>
              <span className="flex shrink-0 items-center">
                <Link
                  href={`/admin/popups/${p.id}`}
                  className="bg-ink text-paper hover:bg-ink-soft flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold"
                >
                  <Pencil className="size-3.5" />
                  עריכה
                </Link>
                <button
                  type="button"
                  onClick={() => create(p)}
                  disabled={busy}
                  className="text-ink-soft hover:bg-paper-dark rounded-lg p-2"
                  aria-label={`שכפול ${p.name}`}
                  title="שכפול"
                >
                  <Copy className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(p)}
                  className="text-pink hover:bg-pink/10 rounded-lg p-2"
                  aria-label={`מחיקת ${p.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-pink mb-3 text-sm">{error}</p>}
      <button
        type="button"
        onClick={() => create()}
        disabled={busy}
        className="border-ink/20 text-ink-soft hover:border-pink hover:text-pink flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed py-5 text-sm font-semibold"
      >
        <Plus className="size-4" />
        {busy ? 'יוצר…' : 'חלון קופץ חדש'}
      </button>
      {popups.length > 1 && (
        <p className="text-ink-soft mt-3 text-xs">
          אם כמה חלונות פעילים באותו רגע — מוצג רק העליון ברשימה.
        </p>
      )}
    </div>
  )
}
