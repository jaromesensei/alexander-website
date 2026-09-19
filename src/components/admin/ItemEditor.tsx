'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, ChevronUp, ChevronDown, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ImageUploadButton } from './ImageUploadButton'
import type { MenuItem } from '@/types/db'

export function ItemEditor({
  item,
  canMoveUp,
  canMoveDown,
  onMove,
}: {
  item: MenuItem
  canMoveUp: boolean
  canMoveDown: boolean
  onMove: (direction: 'up' | 'down') => void
}) {
  const router = useRouter()
  const [nameHe, setNameHe] = useState(item.name_he)
  const [descriptionHe, setDescriptionHe] = useState(item.description_he ?? '')
  const [price, setPrice] = useState((item.price_agorot / 100).toFixed(2))
  const [imageUrl, setImageUrl] = useState(item.image_url)
  const [isAvailable, setIsAvailable] = useState(item.is_available)
  const [isFeatured, setIsFeatured] = useState(item.is_featured)
  const [tags, setTags] = useState(item.tags.join(', '))
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('menu_items')
      .update({
        name_he: nameHe,
        description_he: descriptionHe || null,
        price_agorot: Math.round(parseFloat(price || '0') * 100),
        image_url: imageUrl,
        is_available: isAvailable,
        is_featured: isFeatured,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      })
      .eq('id', item.id)
    setSaving(false)
    router.refresh()
  }

  async function remove() {
    if (!confirm(`למחוק את "${item.name_he}"?`)) return
    const supabase = createClient()
    await supabase.from('menu_items').delete().eq('id', item.id)
    router.refresh()
  }

  return (
    <div className="border-charcoal/10 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row">
      <ImageUploadButton value={imageUrl} onChange={setImageUrl} folder="menu" />

      <div className="flex-1 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            value={nameHe}
            onChange={(e) => setNameHe(e.target.value)}
            placeholder="שם המנה"
          />
          <div className="relative">
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              inputMode="decimal"
              placeholder="מחיר"
              className="ps-8"
            />
            <span className="text-charcoal-soft absolute inset-y-0 start-3 flex items-center">
              ₪
            </span>
          </div>
        </div>
        <Textarea
          value={descriptionHe}
          onChange={(e) => setDescriptionHe(e.target.value)}
          placeholder="תיאור קצר"
          rows={2}
        />
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="תגיות, מופרדות בפסיק (למשל: צמחוני, חריף)"
        />
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            זמין בתפריט
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            <Star className="size-3.5" />
            מומלץ (מופיע בעמוד הבית)
          </label>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-1">
            <button
              type="button"
              disabled={!canMoveUp}
              onClick={() => onMove('up')}
              className="text-charcoal-soft hover:bg-cream-dark rounded-lg p-1.5 disabled:opacity-30"
              aria-label="הזזה למעלה"
            >
              <ChevronUp className="size-4" />
            </button>
            <button
              type="button"
              disabled={!canMoveDown}
              onClick={() => onMove('down')}
              className="text-charcoal-soft hover:bg-cream-dark rounded-lg p-1.5 disabled:opacity-30"
              aria-label="הזזה למטה"
            >
              <ChevronDown className="size-4" />
            </button>
            <button
              type="button"
              onClick={remove}
              className="text-ketchup hover:bg-ketchup/10 rounded-lg p-1.5"
              aria-label="מחיקה"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
          <Button type="button" size="sm" onClick={save} disabled={saving}>
            {saving ? 'שומר…' : 'שמירה'}
          </Button>
        </div>
      </div>
    </div>
  )
}
