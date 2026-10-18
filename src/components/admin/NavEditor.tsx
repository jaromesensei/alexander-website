'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { publishContent } from '@/app/admin/actions'
import { DEFAULT_NAV } from '@/lib/links'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { IconButton, LinkTargetSelect } from './editor/fields'
import type { LinkOption } from '@/lib/blocks/linkOptions'
import type { NavItem } from '@/types/db'

/** עריכת הקישורים בתפריט העליון ובפוטר. */
export function NavEditor({
  settingsId,
  initial,
  linkOptions,
}: {
  settingsId: string
  initial: NavItem[]
  linkOptions: LinkOption[]
}) {
  const [items, setItems] = useState(initial)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  // מפתח יציב לכל שורה כדי שהבוחר לא יאבד מצב בזמן הזזה
  const [keys, setKeys] = useState(() => initial.map((_, i) => i))
  const [nextKey, setNextKey] = useState(initial.length)

  function change(next: NavItem[], nextKeys = keys) {
    setItems(next)
    setKeys(nextKeys)
    setStatus('idle')
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    const nk = [...keys]
    ;[next[i], next[j]] = [next[j], next[i]]
    ;[nk[i], nk[j]] = [nk[j], nk[i]]
    change(next, nk)
  }

  async function save() {
    if (settingsId === 'fallback') {
      setStatus('error')
      return
    }
    setStatus('saving')
    const cleaned = items.filter((i) => i.label.trim() && i.href.trim())
    const { error } = await createClient()
      .from('restaurant_settings')
      .update({ nav_items: cleaned })
      .eq('id', settingsId)
    if (error) {
      setStatus('error')
      return
    }
    await publishContent()
    setStatus('saved')
  }

  return (
    <section>
      <h2 className="mb-1 text-xl font-bold">תפריט הניווט</h2>
      <p className="text-ink-soft mb-4 text-sm">הקישורים בראש האתר ובפוטר, לפי הסדר.</p>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={keys[i]}
            className="border-ink/10 grid gap-2 rounded-2xl border bg-white p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-start"
          >
            <Input
              value={item.label}
              onChange={(e) =>
                change(
                  items.map((it, j) => (j === i ? { ...it, label: e.target.value } : it)),
                )
              }
              placeholder="טקסט הקישור"
            />
            <LinkTargetSelect
              value={item.href}
              options={linkOptions}
              onChange={(href) =>
                change(items.map((it, j) => (j === i ? { ...it, href } : it)))
              }
            />
            <div className="flex items-center justify-end sm:h-12">
              <IconButton
                label="הזזה למעלה"
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                <ChevronUp className="size-4" />
              </IconButton>
              <IconButton
                label="הזזה למטה"
                disabled={i === items.length - 1}
                onClick={() => move(i, 1)}
              >
                <ChevronDown className="size-4" />
              </IconButton>
              <IconButton
                label="מחיקה"
                danger
                onClick={() =>
                  change(
                    items.filter((_, j) => j !== i),
                    keys.filter((_, j) => j !== i),
                  )
                }
              >
                <Trash2 className="size-4" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            change([...items, { label: '', href: '/menu' }], [...keys, nextKey])
            setNextKey((k) => k + 1)
          }}
          className="text-pink flex items-center gap-1.5 text-sm font-semibold hover:underline"
        >
          <Plus className="size-4" />
          הוספת קישור
        </button>
        <button
          type="button"
          onClick={() => {
            change(
              DEFAULT_NAV,
              DEFAULT_NAV.map((_, i) => nextKey + i),
            )
            setNextKey((k) => k + DEFAULT_NAV.length)
          }}
          className="text-ink-soft hover:text-ink flex items-center gap-1.5 text-sm"
        >
          <RotateCcw className="size-4" />
          איפוס לברירת המחדל
        </button>
        <span className="flex-1" />
        {status === 'saved' && <span className="text-ink-soft text-sm">נשמר</span>}
        {status === 'error' && (
          <span className="text-pink text-sm">
            {settingsId === 'fallback'
              ? 'קודם צריך לשמור פעם אחת את ההגדרות'
              : 'השמירה נכשלה — האם המיגרציה 0003 הורצה?'}
          </span>
        )}
        <Button onClick={save} disabled={status === 'saving'}>
          {status === 'saving' ? 'שומר…' : 'שמירת התפריט'}
        </Button>
      </div>
    </section>
  )
}
