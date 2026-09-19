'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { CategoryEditor } from './CategoryEditor'
import type { CategoryWithItems } from '@/lib/data/menu'

export function MenuAdminClient({ categories }: { categories: CategoryWithItems[] }) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  async function addCategory() {
    if (!newName.trim()) return
    const supabase = createClient()
    await supabase.from('menu_categories').insert({
      name_he: newName.trim(),
      sort_order: categories.length + 1,
      is_active: true,
    })
    setNewName('')
    setAdding(false)
    router.refresh()
  }

  async function moveCategory(index: number, direction: 'up' | 'down') {
    const swapWith = direction === 'up' ? index - 1 : index + 1
    if (swapWith < 0 || swapWith >= categories.length) return
    const a = categories[index]
    const b = categories[swapWith]
    const supabase = createClient()
    await Promise.all([
      supabase
        .from('menu_categories')
        .update({ sort_order: b.sort_order })
        .eq('id', a.id),
      supabase
        .from('menu_categories')
        .update({ sort_order: a.sort_order })
        .eq('id', b.id),
    ])
    router.refresh()
  }

  return (
    <div className="space-y-5">
      {categories.map((category, i) => (
        <CategoryEditor
          key={category.id}
          category={category}
          canMoveUp={i > 0}
          canMoveDown={i < categories.length - 1}
          onMove={(dir) => moveCategory(i, dir)}
        />
      ))}

      {adding ? (
        <div className="border-charcoal/20 flex gap-2 rounded-2xl border border-dashed p-4">
          <Input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="שם הקטגוריה החדשה (למשל: קינוחים)"
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          />
          <Button onClick={addCategory}>הוספה</Button>
          <Button variant="ghost" onClick={() => setAdding(false)}>
            ביטול
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="border-charcoal/20 text-charcoal-soft hover:border-ketchup hover:text-ketchup flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed py-6 text-sm font-semibold"
        >
          <Plus className="size-4" />
          הוספת קטגוריה
        </button>
      )}
    </div>
  )
}
