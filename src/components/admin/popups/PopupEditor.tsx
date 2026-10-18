'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { publishContent } from '@/app/admin/actions'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  BgField,
  FieldShell,
  Input,
  LinkField,
  SegmentedField,
  Textarea,
} from '../editor/fields'
import { ImageField } from '../media/ImageField'
import { PopupCard } from '@/components/popups/PopupCard'
import {
  DAY_NAMES,
  DAY_SHORT,
  describeSchedule,
  popupStatus,
  zonedNow,
  type ZonedNow,
} from '@/lib/popups/schedule'
import { STATUS_LABEL } from './PopupsAdminClient'
import { cn } from '@/lib/utils'
import type { LinkOption } from '@/lib/blocks/linkOptions'
import type { Popup, RestaurantSettings } from '@/types/db'

const DAY_PRESETS = [
  { label: 'כל יום', days: [0, 1, 2, 3, 4, 5, 6] },
  { label: 'ראשון–חמישי', days: [0, 1, 2, 3, 4] },
  { label: 'סוף שבוע', days: [4, 5, 6] },
]

export function PopupEditor({
  initial,
  settings,
  linkOptions,
}: {
  initial: Popup
  settings: RestaurantSettings
  linkOptions: LinkOption[]
}) {
  const [form, setForm] = useState(initial)
  const [saved, setSaved] = useState(() => JSON.stringify(initial))
  const dirty = useMemo(() => JSON.stringify(form) !== saved, [form, saved])
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState<ZonedNow | null>(null)

  useEffect(() => {
    // הסטטוס "מוצג עכשיו" תלוי בשעה — מחושב בדפדפן ומתעדכן כל חצי דקה
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(zonedNow())
    const timer = window.setInterval(() => setNow(zonedNow()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  function set<K extends keyof Popup>(key: K, value: Popup[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setStatus('idle')
  }

  function toggleDay(day: number) {
    set(
      'days',
      form.days.includes(day)
        ? form.days.filter((d) => d !== day)
        : [...form.days, day].sort((a, b) => a - b),
    )
  }

  const allDay = !form.start_time || !form.end_time

  function validate(): string | null {
    if (!form.heading.trim()) return 'חסרה כותרת'
    if (form.days.length === 0) return 'בחרו לפחות יום אחד'
    if (form.start_date && form.end_date && form.start_date > form.end_date) {
      return 'תאריך הסיום לפני תאריך ההתחלה'
    }
    return null
  }

  async function save() {
    const invalid = validate()
    if (invalid) {
      setError(invalid)
      setStatus('error')
      return
    }
    setStatus('saving')
    setError(null)
    const updated_at = new Date().toISOString()
    const { error: saveError } = await createClient()
      .from('popups')
      .update({
        name: form.name.trim() || 'חלון קופץ',
        heading: form.heading,
        body: form.body || null,
        image_url: form.image_url,
        image_alt: form.image_alt || null,
        button: form.button,
        bg: form.bg,
        is_active: form.is_active,
        days: form.days,
        start_time: allDay ? null : form.start_time,
        end_time: allDay ? null : form.end_time,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        frequency: form.frequency,
        delay_seconds: form.delay_seconds,
        placement: form.placement,
        updated_at,
      })
      .eq('id', form.id)
    if (saveError) {
      setStatus('error')
      setError(`השמירה נכשלה: ${saveError.message}`)
      return
    }
    await publishContent()
    const next = { ...form, updated_at }
    setForm(next)
    setSaved(JSON.stringify(next))
    setStatus('idle')
  }

  const liveStatus = now ? popupStatus(form, now) : null

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/admin/popups"
          className="text-ink-soft hover:bg-paper-dark rounded-lg p-2"
          aria-label="חזרה לרשימה"
        >
          <ArrowRight className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold">{form.name || 'חלון קופץ'}</h1>
          <p
            className={cn('text-sm', status === 'error' ? 'text-pink' : 'text-ink-soft')}
          >
            {status === 'error' ? error : dirty ? 'יש שינויים שלא נשמרו' : 'הכול שמור'}
          </p>
        </div>
        <Button onClick={save} disabled={status === 'saving' || !dirty}>
          {status === 'saving' ? (
            'שומר…'
          ) : dirty ? (
            'שמירה'
          ) : (
            <>
              <Check className="size-4" /> נשמר
            </>
          )}
        </Button>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Card className="space-y-4 rounded-2xl p-5">
            <h2 className="text-lg font-bold">תוכן</h2>
            <FieldShell label="שם פנימי" help="רק לניהול, הלקוחות לא רואים אותו">
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} />
            </FieldShell>
            <FieldShell label="תמונה (לא חובה)">
              <ImageField
                value={form.image_url}
                onChange={(url) => set('image_url', url)}
                folder="popups"
                aspect="aspect-[4/3]"
              />
            </FieldShell>
            {form.image_url && (
              <FieldShell
                label="תיאור התמונה (לנגישות)"
                help="אם בתמונה יש טקסט (פלייר) — כתבו אותו כאן. מוקרא לאנשים עיוורים."
              >
                <Input
                  value={form.image_alt ?? ''}
                  onChange={(e) => set('image_alt', e.target.value)}
                />
              </FieldShell>
            )}
            <FieldShell label="כותרת">
              <Textarea
                rows={2}
                value={form.heading}
                onChange={(e) => set('heading', e.target.value)}
              />
            </FieldShell>
            <FieldShell label="טקסט">
              <Textarea
                rows={3}
                value={form.body ?? ''}
                onChange={(e) => set('body', e.target.value)}
              />
            </FieldShell>
            <FieldShell label="כפתור">
              <LinkField
                value={form.button}
                options={linkOptions}
                onChange={(v) => set('button', v)}
              />
            </FieldShell>
            <FieldShell label="צבע רקע">
              <BgField value={form.bg} onChange={(v) => set('bg', v)} />
            </FieldShell>
          </Card>

          <Card className="space-y-5 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">מתי מופיע</h2>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => set('is_active', e.target.checked)}
                  className="size-4"
                />
                פעיל
              </label>
            </div>

            <FieldShell label="ימים">
              <div className="flex flex-wrap gap-1.5">
                {DAY_SHORT.map((label, day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    aria-pressed={form.days.includes(day)}
                    aria-label={DAY_NAMES[day]}
                    title={DAY_NAMES[day]}
                    className={cn(
                      'size-10 rounded-full border text-sm font-bold',
                      form.days.includes(day)
                        ? 'bg-ink border-ink text-paper'
                        : 'border-ink/20 text-ink-soft hover:border-ink',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                {DAY_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => set('days', preset.days)}
                    className="text-pink text-xs font-semibold hover:underline"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </FieldShell>

            <FieldShell
              label="שעות"
              help="לפי שעון ישראל. שעות שחוצות חצות (22:00–02:00) עובדות."
            >
              <label className="mb-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(e) => {
                    setForm((f) => ({
                      ...f,
                      start_time: e.target.checked ? null : '17:00',
                      end_time: e.target.checked ? null : '19:00',
                    }))
                    setStatus('idle')
                  }}
                />
                כל היום
              </label>
              {!allDay && (
                <div className="flex items-center gap-2" dir="ltr">
                  <Input
                    type="time"
                    value={form.start_time ?? ''}
                    onChange={(e) => set('start_time', e.target.value)}
                    className="h-11 w-32"
                    aria-label="משעה"
                  />
                  <span>–</span>
                  <Input
                    type="time"
                    value={form.end_time ?? ''}
                    onChange={(e) => set('end_time', e.target.value)}
                    className="h-11 w-32"
                    aria-label="עד שעה"
                  />
                </div>
              )}
            </FieldShell>

            <FieldShell
              label="תאריכים (לא חובה)"
              help="השאירו ריק כדי שהחלון יחזור כל שבוע ללא הגבלה"
            >
              <div className="grid grid-cols-2 gap-2">
                <label className="text-ink-soft text-xs">
                  מתאריך
                  <Input
                    type="date"
                    value={form.start_date ?? ''}
                    onChange={(e) => set('start_date', e.target.value || null)}
                    className="h-11"
                  />
                </label>
                <label className="text-ink-soft text-xs">
                  עד תאריך
                  <Input
                    type="date"
                    value={form.end_date ?? ''}
                    onChange={(e) => set('end_date', e.target.value || null)}
                    className="h-11"
                  />
                </label>
              </div>
            </FieldShell>

            <FieldShell label="כמה פעמים מבקר רואה אותו">
              <SegmentedField
                value={form.frequency}
                options={[
                  { value: 'session', label: 'בכל ביקור' },
                  { value: 'day', label: 'פעם ביום' },
                  { value: 'once', label: 'פעם אחת' },
                ]}
                onChange={(v) => set('frequency', v as Popup['frequency'])}
              />
            </FieldShell>

            <FieldShell label="איפה">
              <SegmentedField
                value={form.placement}
                options={[
                  { value: 'all', label: 'כל האתר' },
                  { value: 'home', label: 'עמוד הבית' },
                  { value: 'menu', label: 'תפריט' },
                ]}
                onChange={(v) => set('placement', v as Popup['placement'])}
              />
            </FieldShell>

            <FieldShell label="להציג אחרי (שניות)">
              <Input
                type="number"
                dir="ltr"
                min={0}
                max={60}
                value={form.delay_seconds}
                onChange={(e) =>
                  set(
                    'delay_seconds',
                    Math.min(60, Math.max(0, Number(e.target.value) || 0)),
                  )
                }
                className="h-11 w-24"
              />
            </FieldShell>
          </Card>
        </div>

        {/* תצוגה מקדימה */}
        <div className="space-y-3 lg:sticky lg:top-8">
          <div className="border-ink/10 rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">{describeSchedule(form)}</span>
              {liveStatus && (
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
                    STATUS_LABEL[liveStatus].className,
                  )}
                >
                  {STATUS_LABEL[liveStatus].text}
                </span>
              )}
            </div>
            {liveStatus === 'scheduled' && (
              <p className="text-ink-soft mt-1 text-xs">
                פעיל, אבל לא בשעה הזו — יופיע לבד בזמנים שהוגדרו.
              </p>
            )}
          </div>
          <div className="bg-ink/60 flex min-h-[520px] items-center justify-center rounded-2xl p-4">
            <PopupCard popup={form} settings={settings} />
          </div>
          <p className="text-ink-soft text-center text-xs">
            תצוגה מקדימה — כך זה ייראה באתר
          </p>
        </div>
      </div>
    </div>
  )
}
