'use client'

import { useState } from 'react'
import { Trash2, ChevronUp, ChevronDown, Star, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { publishContent } from '@/app/admin/actions'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ImageUploadButton } from './ImageUploadButton'
import { TagPicker } from './TagPicker'
import { PriceVariantsField, type VariantDraft } from './PriceVariantsField'
import { normalizeTag } from '@/lib/menu/tags'
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
  const [nameHe, setNameHe] = useState(item.name_he)
  const [descriptionHe, setDescriptionHe] = useState(item.description_he ?? '')
  const [price, setPrice] = useState((item.price_agorot / 100).toFixed(2))
  const [variants, setVariants] = useState<VariantDraft[]>(
    (item.price_variants ?? []).map((v) => ({
      label: v.label,
      price: (v.price_agorot / 100).toString(),
    })),
  )
  const [imageUrl, setImageUrl] = useState(item.image_url)
  const [isAvailable, setIsAvailable] = useState(item.is_available)
  const [isFeatured, setIsFeatured] = useState(item.is_featured)
  const [tags, setTags] = useState(item.tags.map(normalizeTag))
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // כל שינוי בשדה מחזיר את הכפתור למצב "שמירה"
  function edit<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v)
      setStatus('idle')
    }
  }

  async function save() {
    setStatus('saving')
    const toAgorot = (p: string) => Math.round(parseFloat(p || '0') * 100)
    const cleanVariants = variants
      .filter((v) => v.price.trim())
      .map((v) => ({ label: v.label.trim(), price_agorot: toAgorot(v.price) }))
    const supabase = createClient()
    const { error } = await supabase
      .from('menu_items')
      .update({
        name_he: nameHe,
        description_he: descriptionHe || null,
        // עם גדלים — המחיר הבסיסי הוא הנמוך מביניהם (למיון ולמנות מומלצות)
        price_agorot: cleanVariants.length
          ? Math.min(...cleanVariants.map((v) => v.price_agorot))
          : toAgorot(price),
        price_variants: cleanVariants.length ? cleanVariants : null,
        image_url: imageUrl,
        is_available: isAvailable,
        is_featured: isFeatured,
        tags,
      })
      .eq('id', item.id)
    if (error) {
      setStatus('error')
      return
    }
    await publishContent()
    setStatus('saved')
  }

  async function remove() {
    if (!confirm(`למחוק את "${item.name_he}"?`)) return
    const supabase = createClient()
    await supabase.from('menu_items').delete().eq('id', item.id)
    await publishContent()
  }

  return (
    <div className="border-ink/10 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row">
      <ImageUploadButton value={imageUrl} onChange={edit(setImageUrl)} folder="menu" />

      <div className="flex-1 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            value={nameHe}
            onChange={(e) => edit(setNameHe)(e.target.value)}
            placeholder="שם המנה"
          />
          <div className="relative">
            <Input
              value={variants.length ? '' : price}
              onChange={(e) => edit(setPrice)(e.target.value)}
              inputMode="decimal"
              placeholder={variants.length ? 'לפי גודל ↓' : 'מחיר'}
              disabled={variants.length > 0}
              aria-label="מחיר"
              className="ps-8 disabled:opacity-60"
            />
            <span className="text-ink-soft absolute inset-y-0 start-3 flex items-center">
              ₪
            </span>
          </div>
        </div>
        <Textarea
          value={descriptionHe}
          onChange={(e) => edit(setDescriptionHe)(e.target.value)}
          placeholder="תיאור קצר"
          rows={2}
        />
        <PriceVariantsField value={variants} onChange={edit(setVariants)} />
        <TagPicker value={tags} onChange={edit(setTags)} />
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => edit(setIsAvailable)(e.target.checked)}
            />
            זמין בתפריט
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => edit(setIsFeatured)(e.target.checked)}
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
              className="text-ink-soft hover:bg-paper-dark rounded-lg p-1.5 disabled:opacity-30"
              aria-label="הזזה למעלה"
            >
              <ChevronUp className="size-4" />
            </button>
            <button
              type="button"
              disabled={!canMoveDown}
              onClick={() => onMove('down')}
              className="text-ink-soft hover:bg-paper-dark rounded-lg p-1.5 disabled:opacity-30"
              aria-label="הזזה למטה"
            >
              <ChevronDown className="size-4" />
            </button>
            <button
              type="button"
              onClick={remove}
              className="text-pink hover:bg-pink/10 rounded-lg p-1.5"
              aria-label="מחיקה"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            {status === 'error' && (
              <span className="text-pink text-sm">השמירה נכשלה</span>
            )}
            <Button
              type="button"
              size="sm"
              variant={status === 'saved' ? 'outline' : 'primary'}
              onClick={save}
              disabled={status === 'saving' || status === 'saved'}
            >
              {status === 'saving' ? (
                'שומר…'
              ) : status === 'saved' ? (
                <>
                  <Check className="size-4" /> נשמר
                </>
              ) : (
                'שמירה'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
