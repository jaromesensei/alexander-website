'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronUp, ChevronDown, Trash2, Plus, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ItemEditor } from './ItemEditor'
import { cn } from '@/lib/utils'
import type { MenuItem } from '@/types/db'
import type { CategoryWithItems } from '@/lib/data/menu'

export function CategoryEditor({
  category,
  canMoveUp,
  canMoveDown,
  onMove,
}: {
  category: CategoryWithItems
  canMoveUp: boolean
  canMoveDown: boolean
  onMove: (direction: 'up' | 'down') => void
}) {
  const router = useRouter()
  const [name, setName] = useState(category.name_he)
  const [addingItem, setAddingItem] = useState(false)
  const [newItemName, setNewItemName] = useState('')

  async function saveName() {
    if (name === category.name_he) return
    const supabase = createClient()
    await supabase.from('menu_categories').update({ name_he: name }).eq('id', category.id)
    router.refresh()
  }

  async function toggleActive() {
    const supabase = createClient()
    await supabase
      .from('menu_categories')
      .update({ is_active: !category.is_active })
      .eq('id', category.id)
    router.refresh()
  }

  async function removeCategory() {
    if (category.items.length > 0) {
      alert('אי אפשר למחוק קטגוריה עם מנות בתוכה — קודם למחוק או להעביר את המנות.')
      return
    }
    if (!confirm(`למחוק את הקטגוריה "${category.name_he}"?`)) return
    const supabase = createClient()
    await supabase.from('menu_categories').delete().eq('id', category.id)
    router.refresh()
  }

  async function addItem() {
    if (!newItemName.trim()) return
    const supabase = createClient()
    await supabase.from('menu_items').insert({
      category_id: category.id,
      name_he: newItemName.trim(),
      price_agorot: 0,
      sort_order: category.items.length + 1,
      is_available: true,
      is_featured: false,
      tags: [],
    })
    setNewItemName('')
    setAddingItem(false)
    router.refresh()
  }

  async function moveItem(items: MenuItem[], index: number, direction: 'up' | 'down') {
    const swapWith = direction === 'up' ? index - 1 : index + 1
    if (swapWith < 0 || swapWith >= items.length) return
    const a = items[index]
    const b = items[swapWith]
    const supabase = createClient()
    await Promise.all([
      supabase.from('menu_items').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('menu_items').update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
    router.refresh()
  }

  return (
    <div
      className={cn(
        'border-charcoal/10 rounded-2xl border bg-white p-5',
        !category.is_active && 'opacity-60',
      )}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
          className="font-display max-w-xs text-lg"
        />
        <div className="ms-auto flex items-center gap-1">
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
            onClick={toggleActive}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold',
              category.is_active
                ? 'text-charcoal-soft hover:bg-cream-dark'
                : 'bg-mustard/20 text-mustard-dark',
            )}
          >
            <EyeOff className="size-3.5" />
            {category.is_active ? 'הסתרה' : 'מוסתר — הצגה'}
          </button>
          <button
            type="button"
            onClick={removeCategory}
            className="text-ketchup hover:bg-ketchup/10 rounded-lg p-1.5"
            aria-label="מחיקת קטגוריה"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {category.items.map((item, i) => (
          <ItemEditor
            key={item.id}
            item={item}
            canMoveUp={i > 0}
            canMoveDown={i < category.items.length - 1}
            onMove={(dir) => moveItem(category.items, i, dir)}
          />
        ))}
      </div>

      {addingItem ? (
        <div className="mt-3 flex gap-2">
          <Input
            autoFocus
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="שם המנה החדשה"
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
          />
          <Button size="sm" onClick={addItem}>
            הוספה
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setAddingItem(false)}>
            ביטול
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAddingItem(true)}
          className="text-ketchup mt-4 flex items-center gap-1.5 text-sm font-semibold hover:underline"
        >
          <Plus className="size-4" />
          הוספת מנה
        </button>
      )}
    </div>
  )
}
