'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { MENU_TAGS, TAG_KEYS, isMenuTag, normalizeTag } from '@/lib/menu/tags'
import { TAG_ICONS } from '@/components/menu/tagIcons'
import { cn } from '@/lib/utils'

const GROUPS = [
  { kind: 'highlight', title: 'הדגשה' },
  { kind: 'diet', title: 'תזונה ואלרגנים' },
] as const

export function TagPicker({
  value,
  onChange,
}: {
  value: string[]
  onChange: (tags: string[]) => void
}) {
  const selected = value.map(normalizeTag)
  const custom = selected.filter((t) => !isMenuTag(t))
  const [draft, setDraft] = useState('')

  function toggle(key: string) {
    onChange(
      selected.includes(key) ? selected.filter((t) => t !== key) : [...selected, key],
    )
  }

  function addCustom() {
    const t = normalizeTag(draft)
    if (t && !selected.includes(t)) onChange([...selected, t])
    setDraft('')
  }

  return (
    <div className="space-y-3">
      {GROUPS.map((group) => (
        <div key={group.kind}>
          <p className="text-ink-soft mb-1.5 text-xs font-semibold">{group.title}</p>
          <div className="flex flex-wrap gap-1.5">
            {TAG_KEYS.filter((k) => MENU_TAGS[k].kind === group.kind).map((key) => {
              const Icon = TAG_ICONS[key]
              const on = selected.includes(key)
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(key)}
                  className={cn(
                    'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors',
                    on
                      ? group.kind === 'highlight'
                        ? 'bg-mustard border-mustard text-ink'
                        : 'border-ink bg-ink text-paper'
                      : 'border-ink/15 text-ink-soft hover:border-ink hover:text-ink',
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {MENU_TAGS[key].label}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-1.5">
        {custom.map((t) => (
          <span
            key={t}
            className="border-ink/15 inline-flex h-8 items-center gap-1 rounded-full border ps-3 pe-1.5 text-sm"
          >
            {t}
            <button
              type="button"
              onClick={() => toggle(t)}
              className="hover:bg-paper-dark rounded-full p-0.5"
              aria-label={`הסרת ${t}`}
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        <span className="inline-flex items-center gap-1">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addCustom()
              }
            }}
            placeholder="תגית אחרת…"
            className="border-ink/15 focus:border-pink h-8 w-32 rounded-full border px-3 text-sm focus:outline-none"
          />
          {draft.trim() && (
            <button
              type="button"
              onClick={addCustom}
              className="text-ink hover:bg-paper-dark rounded-full p-1"
              aria-label="הוספת תגית"
            >
              <Plus className="size-4" />
            </button>
          )}
        </span>
      </div>
    </div>
  )
}
