'use client'

import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { Input, Label, Textarea } from '@/components/ui/Input'
import { FEATURE_ICONS } from '@/lib/blocks/icons'
import { cn } from '@/lib/utils'
import type { LinkOption } from '@/lib/blocks/linkOptions'
import type { BlockBg, FeatureItem, LinkValue } from '@/lib/blocks/types'

export function FieldShell({
  label,
  help,
  children,
}: {
  label: string
  help?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {help && <p className="text-ink-soft mt-1 text-xs">{help}</p>}
    </div>
  )
}

const BG_SWATCHES: { value: BlockBg; label: string; className: string }[] = [
  { value: 'paper', label: 'לבן', className: 'bg-paper border-ink/20' },
  { value: 'ink', label: 'שחור', className: 'bg-ink border-ink' },
  { value: 'pink', label: 'ורוד', className: 'bg-pink border-pink' },
  { value: 'mustard', label: 'חרדל', className: 'bg-mustard border-mustard' },
  { value: 'turquoise', label: 'טורקיז', className: 'bg-turquoise border-turquoise' },
]

export function BgField({
  value,
  onChange,
}: {
  value: BlockBg
  onChange: (v: BlockBg) => void
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {BG_SWATCHES.map((s) => (
        <button
          key={s.value}
          type="button"
          role="radio"
          aria-checked={value === s.value}
          onClick={() => onChange(s.value)}
          className="flex flex-col items-center gap-1 text-xs"
        >
          <span
            className={cn(
              'flex size-9 items-center justify-center rounded-full border-2',
              s.className,
              value === s.value && 'ring-ink ring-2 ring-offset-2',
            )}
          >
            {value === s.value && (
              <Check
                className={cn('size-4', s.value === 'ink' ? 'text-paper' : 'text-ink')}
              />
            )}
          </span>
          {s.label}
        </button>
      ))}
    </div>
  )
}

export function SegmentedField({
  value,
  options,
  onChange,
}: {
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="border-ink/20 inline-flex rounded-xl border p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-semibold',
            value === o.value ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

const CUSTOM = '__custom'

/** בוחר יעד לקישור: עמוד באתר, סקשן, פעולה (וואטסאפ/חיוג) או כתובת חיצונית. */
export function LinkTargetSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: LinkOption[]
  onChange: (href: string) => void
}) {
  const known = options.some((o) => o.value === value)
  const [custom, setCustom] = useState(!known && value !== '')
  const groups = [...new Set(options.map((o) => o.group))]

  return (
    <div className="space-y-2">
      <select
        value={custom ? CUSTOM : value}
        onChange={(e) => {
          if (e.target.value === CUSTOM) {
            setCustom(true)
            onChange('https://')
          } else {
            setCustom(false)
            onChange(e.target.value)
          }
        }}
        className="border-ink/20 focus:border-pink h-12 w-full rounded-xl border bg-white px-3 text-base focus:outline-none"
      >
        {!known && !custom && <option value={value}>בחרו יעד…</option>}
        {groups.map((g) => (
          <optgroup key={g} label={g}>
            {options
              .filter((o) => o.group === g)
              .map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
          </optgroup>
        ))}
        <optgroup label="אחר">
          <option value={CUSTOM}>קישור חיצוני…</option>
        </optgroup>
      </select>
      {custom && (
        <Input
          dir="ltr"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://"
        />
      )}
    </div>
  )
}

export function LinkField({
  value,
  options,
  onChange,
}: {
  value: LinkValue | null
  options: LinkOption[]
  onChange: (v: LinkValue | null) => void
}) {
  return (
    <div className="border-ink/10 space-y-2 rounded-xl border p-3">
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={value !== null}
          onChange={(e) =>
            onChange(e.target.checked ? { label: 'לפרטים', href: '/menu' } : null)
          }
        />
        הצגת כפתור
      </label>
      {value && (
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            value={value.label}
            onChange={(e) => onChange({ ...value, label: e.target.value })}
            placeholder="טקסט הכפתור"
          />
          <LinkTargetSelect
            value={value.href}
            options={options}
            onChange={(href) => onChange({ ...value, href })}
          />
        </div>
      )}
    </div>
  )
}

export function FeaturesField({
  value,
  onChange,
}: {
  value: FeatureItem[]
  onChange: (v: FeatureItem[]) => void
}) {
  function update(i: number, patch: Partial<FeatureItem>) {
    onChange(value.map((item, j) => (j === i ? { ...item, ...patch } : item)))
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="border-ink/10 space-y-2 rounded-xl border p-3">
          <div className="flex items-center gap-2">
            <select
              value={item.icon}
              onChange={(e) => update(i, { icon: e.target.value })}
              className="border-ink/20 h-10 rounded-lg border bg-white px-2 text-sm"
              aria-label="אייקון"
            >
              {Object.entries(FEATURE_ICONS).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <Input
              value={item.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="כותרת"
              className="h-10"
            />
          </div>
          <Input
            value={item.text}
            onChange={(e) => update(i, { text: e.target.value })}
            placeholder="תיאור קצר"
            className="h-10"
          />
          <div className="flex justify-end gap-1">
            <IconButton label="הזזה למעלה" disabled={i === 0} onClick={() => move(i, -1)}>
              <ChevronUp className="size-4" />
            </IconButton>
            <IconButton
              label="הזזה למטה"
              disabled={i === value.length - 1}
              onClick={() => move(i, 1)}
            >
              <ChevronDown className="size-4" />
            </IconButton>
            <IconButton
              label="מחיקת פריט"
              danger
              onClick={() => onChange(value.filter((_, j) => j !== i))}
            >
              <Trash2 className="size-4" />
            </IconButton>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...value, { icon: 'star', title: 'פריט חדש', text: '' }])
        }
        className="text-pink flex items-center gap-1.5 text-sm font-semibold hover:underline"
      >
        <Plus className="size-4" />
        הוספת פריט
      </button>
    </div>
  )
}

export function IconButton({
  label,
  onClick,
  disabled,
  danger,
  active,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'rounded-lg p-1.5 disabled:opacity-30',
        danger ? 'text-pink hover:bg-pink/10' : 'text-ink-soft hover:bg-paper-dark',
        active && 'bg-mustard text-ink hover:bg-mustard',
      )}
    >
      {children}
    </button>
  )
}

export { Input, Textarea }
