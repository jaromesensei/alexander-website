'use client'

import { useMemo, useState } from 'react'
import { ExternalLink, RotateCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { publishContent } from '@/app/admin/actions'
import { SITE_TEXT_GROUPS } from '@/lib/siteTexts'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input, Label, Textarea } from '@/components/ui/Input'

export function SiteTextsEditor({
  settingsId,
  initial,
}: {
  settingsId: string
  initial: Record<string, string>
}) {
  const [values, setValues] = useState(initial)
  const [saved, setSaved] = useState(() => JSON.stringify(initial))
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const dirty = useMemo(() => JSON.stringify(values) !== saved, [values, saved])

  function set(key: string, value: string) {
    setValues((v) => {
      const next = { ...v }
      if (value) next[key] = value
      else delete next[key]
      return next
    })
    setStatus('idle')
  }

  async function save() {
    if (settingsId === 'fallback') {
      setStatus('error')
      setError('קודם צריך לשמור פעם אחת את מסך ההגדרות')
      return
    }
    setStatus('saving')
    // שומרים רק מה ששונה מברירת המחדל
    const defaults = new Map<string, string>(
      SITE_TEXT_GROUPS.flatMap((g) => g.items.map((i) => [i.key, i.default] as const)),
    )
    const cleaned = Object.fromEntries(
      Object.entries(values).filter(([k, v]) => v.trim() && v !== defaults.get(k)),
    )
    const { error: saveError } = await createClient()
      .from('restaurant_settings')
      .update({ site_texts: cleaned })
      .eq('id', settingsId)
    if (saveError) {
      setStatus('error')
      setError(
        saveError.message.includes('site_texts')
          ? 'צריך להריץ ב-Supabase את המיגרציה 0006_site_texts.sql'
          : `השמירה נכשלה: ${saveError.message}`,
      )
      return
    }
    await publishContent()
    setValues(cleaned)
    setSaved(JSON.stringify(cleaned))
    setStatus('idle')
  }

  return (
    <div className="space-y-6 pb-24">
      {SITE_TEXT_GROUPS.map((group) => (
        <Card key={group.title} className="space-y-4 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">{group.title}</h2>
            {group.href && (
              <a
                href={group.href}
                target="_blank"
                rel="noreferrer"
                className="text-ink-soft hover:text-ink flex items-center gap-1 text-sm"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                צפייה
              </a>
            )}
          </div>
          {group.items.map((item) => {
            const id = `text-${item.key}`
            const value = values[item.key] ?? ''
            const multiline = 'multiline' in item && item.multiline
            return (
              <div key={item.key}>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor={id}>{item.label}</Label>
                  {value && (
                    <button
                      type="button"
                      onClick={() => set(item.key, '')}
                      className="text-ink-soft hover:text-ink mb-1.5 flex items-center gap-1 text-xs"
                    >
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                      חזרה למקור
                    </button>
                  )}
                </div>
                {multiline ? (
                  <Textarea
                    id={id}
                    rows={2}
                    value={value}
                    placeholder={item.default || '(ריק)'}
                    onChange={(e) => set(item.key, e.target.value)}
                  />
                ) : (
                  <Input
                    id={id}
                    value={value}
                    placeholder={item.default || '(ריק)'}
                    onChange={(e) => set(item.key, e.target.value)}
                  />
                )}
              </div>
            )
          })}
        </Card>
      ))}

      <div className="border-ink/10 fixed inset-x-0 bottom-0 z-30 flex items-center justify-end gap-3 border-t bg-white/95 px-4 py-3 backdrop-blur sm:ps-64">
        {status === 'error' && <span className="text-pink text-sm">{error}</span>}
        {!dirty && status === 'idle' && (
          <span className="text-ink-soft text-sm">הכול שמור</span>
        )}
        <Button onClick={save} disabled={!dirty || status === 'saving'}>
          {status === 'saving' ? 'שומר…' : 'שמירה ופרסום'}
        </Button>
      </div>
    </div>
  )
}
