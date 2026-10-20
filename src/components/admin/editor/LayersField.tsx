'use client'

import { ChevronDown, ChevronUp, Layers, Plus, X } from 'lucide-react'
import { ImageUploadButton } from '@/components/admin/ImageUploadButton'
import type { UploadFolder } from '@/lib/supabase/storage'

export interface LayerDraft {
  image_url: string | null
  label: string
}

/**
 * שכבות של שקופית בקרוסלה: מהשכבה העליונה לתחתונה, תמונה + שם המרכיב.
 * כל התמונות באותו גודל (ריבוע), רקע שקוף והמרכיב במרכז.
 */
export function LayersField({
  value,
  onChange,
  folder,
}: {
  value: LayerDraft[]
  onChange: (v: LayerDraft[]) => void
  folder: UploadFolder
}) {
  function update(i: number, patch: Partial<LayerDraft>) {
    onChange(value.map((l, j) => (j === i ? { ...l, ...patch } : l)))
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  if (value.length === 0) {
    return (
      <button
        type="button"
        onClick={() =>
          onChange([
            { image_url: null, label: 'לחמנייה' },
            { image_url: null, label: '' },
          ])
        }
        className="text-pink-dark flex items-center gap-1 text-sm font-semibold hover:underline"
      >
        <Layers className="size-4" aria-hidden="true" />
        שכבות (התמונה נפתחת למרכיבים כשהשקופית במרכז)
      </button>
    )
  }

  return (
    <fieldset className="border-ink/10 space-y-3 rounded-xl border p-3">
      <legend className="px-1 text-sm font-semibold">שכבות — מלמעלה למטה</legend>
      <p className="text-ink-soft text-xs">
        תמונה לכל מרכיב, עם רקע שקוף (PNG). כל התמונות באותו גודל ריבועי, והמרכיב באמצע.
        עם שתי שכבות ומעלה הן מוצגות במקום התמונה ונפתחות כשהשקופית במרכז.
      </p>
      {value.map((layer, i) => (
        <div key={i} className="flex items-center gap-2">
          <ImageUploadButton
            value={layer.image_url}
            onChange={(url) => update(i, { image_url: url })}
            folder={folder}
          />
          <input
            value={layer.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="שם המרכיב, למשל: צ'דר"
            aria-label={`שם השכבה ${i + 1}`}
            className="border-ink/20 focus:border-pink h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm focus:outline-none"
          />
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              aria-label={`הזזת השכבה ${i + 1} למעלה`}
              className="text-ink-soft hover:bg-paper-dark rounded p-0.5 disabled:opacity-30"
            >
              <ChevronUp className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === value.length - 1}
              aria-label={`הזזת השכבה ${i + 1} למטה`}
              className="text-ink-soft hover:bg-paper-dark rounded p-0.5 disabled:opacity-30"
            >
              <ChevronDown className="size-4" aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            aria-label={`הסרת השכבה ${i + 1}`}
            className="text-ink-soft hover:bg-paper-dark rounded-lg p-1.5"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { image_url: null, label: '' }])}
        className="text-pink-dark flex items-center gap-1 text-sm font-semibold hover:underline"
      >
        <Plus className="size-4" aria-hidden="true" />
        שכבה נוספת
      </button>
    </fieldset>
  )
}
