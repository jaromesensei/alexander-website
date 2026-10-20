'use client'

import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { ImageUploadButton } from '@/components/admin/ImageUploadButton'
import { Input, Textarea } from '@/components/ui/Input'
import { IconButton, LinkField } from './fields'
import { LayersField } from './LayersField'
import type { LinkOption } from '@/lib/blocks/linkOptions'
import type { CarouselSlide } from '@/lib/blocks/types'

export const EMPTY_SLIDE: CarouselSlide = {
  title: 'שקופית חדשה',
  text: '',
  badge: '',
  image: null,
  layers: [],
  button: null,
}

/** השקופיות של בלוק קרוסלה: כותרת, תגית, טקסט, תמונה או שכבות, וכפתור. */
export function SlidesField({
  value,
  onChange,
  linkOptions,
}: {
  value: CarouselSlide[]
  onChange: (v: CarouselSlide[]) => void
  linkOptions: LinkOption[]
}) {
  function update(i: number, patch: Partial<CarouselSlide>) {
    onChange(value.map((s, j) => (j === i ? { ...s, ...patch } : s)))
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {value.map((slide, i) => (
        <details
          key={i}
          open={value.length === 1}
          className="border-ink/10 rounded-xl border p-3 [&[open]>summary]:mb-3"
        >
          <summary className="cursor-pointer truncate text-sm font-semibold">
            {i + 1}. {slide.title || 'שקופית בלי כותרת'}
          </summary>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={slide.title}
                onChange={(e) => update(i, { title: e.target.value })}
                placeholder="כותרת"
                className="h-10"
              />
              <Input
                value={slide.badge}
                onChange={(e) => update(i, { badge: e.target.value })}
                placeholder="תגית (למשל 54 ₪)"
                aria-label="תגית ליד הכותרת"
                className="h-10 w-36 shrink-0"
              />
            </div>
            <Textarea
              value={slide.text}
              onChange={(e) => update(i, { text: e.target.value })}
              placeholder="טקסט קצר"
              rows={2}
            />
            <div className="flex items-start gap-3">
              <ImageUploadButton
                value={slide.image}
                onChange={(url) => update(i, { image: url })}
                folder="pages"
              />
              <Input
                value={slide.imageAlt ?? ''}
                onChange={(e) => update(i, { imageAlt: e.target.value })}
                placeholder="תיאור התמונה (לנגישות)"
                className="h-10"
              />
            </div>
            <LayersField
              value={slide.layers}
              onChange={(layers) =>
                update(i, {
                  // שכבה בלי תמונה נשמרת כטיוטה בעורך ומסוננת בתצוגה
                  layers: layers.map((l) => ({
                    image_url: l.image_url ?? '',
                    label: l.label,
                  })),
                })
              }
              folder="pages"
            />
            <LinkField
              value={slide.button}
              options={linkOptions}
              onChange={(button) => update(i, { button })}
            />
            <div className="flex justify-end">
              <span className="flex gap-1">
                <IconButton
                  label="הזזה למעלה"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
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
                  label="מחיקת שקופית"
                  danger
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                >
                  <Trash2 className="size-4" />
                </IconButton>
              </span>
            </div>
          </div>
        </details>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { ...EMPTY_SLIDE }])}
        className="text-pink flex items-center gap-1.5 text-sm font-semibold hover:underline"
      >
        <Plus className="size-4" />
        הוספת שקופית
      </button>
    </div>
  )
}
