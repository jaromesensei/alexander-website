'use client'

import { Plus, X } from 'lucide-react'

export interface VariantDraft {
  label: string
  price: string
}

/** כמה מחירים למנה אחת (גדלים/סוגים), למשל: קטן 18 / גדול 32. */
export function PriceVariantsField({
  value,
  onChange,
}: {
  value: VariantDraft[]
  onChange: (v: VariantDraft[]) => void
}) {
  function update(i: number, patch: Partial<VariantDraft>) {
    onChange(value.map((v, j) => (j === i ? { ...v, ...patch } : v)))
  }

  if (value.length === 0) {
    return (
      <button
        type="button"
        onClick={() =>
          onChange([
            { label: 'קטן', price: '' },
            { label: 'גדול', price: '' },
          ])
        }
        className="text-pink-dark flex items-center gap-1 text-sm font-semibold hover:underline"
      >
        <Plus className="size-4" aria-hidden="true" />
        כמה מחירים (גדלים)
      </button>
    )
  }

  return (
    <fieldset className="border-ink/10 space-y-2 rounded-xl border p-3">
      <legend className="px-1 text-sm font-semibold">מחירים לפי גודל</legend>
      {value.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={v.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="למשל: קטן / 220 גרם"
            aria-label={`שם הגודל ${i + 1}`}
            className="border-ink/20 focus:border-pink h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm focus:outline-none"
          />
          <div className="relative w-28 shrink-0">
            <input
              value={v.price}
              onChange={(e) => update(i, { price: e.target.value })}
              inputMode="decimal"
              placeholder="מחיר"
              aria-label={`מחיר הגודל ${i + 1}`}
              className="border-ink/20 focus:border-pink h-10 w-full rounded-lg border ps-7 pe-2 text-sm focus:outline-none"
            />
            <span className="text-ink-soft absolute inset-y-0 start-2.5 flex items-center text-sm">
              ₪
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            aria-label={`הסרת הגודל ${i + 1}`}
            className="text-ink-soft hover:bg-paper-dark rounded-lg p-1.5"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { label: '', price: '' }])}
        className="text-pink-dark flex items-center gap-1 text-sm font-semibold hover:underline"
      >
        <Plus className="size-4" aria-hidden="true" />
        גודל נוסף
      </button>
    </fieldset>
  )
}
