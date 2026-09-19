'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { MenuItemCard } from './MenuItemCard'
import type { CategoryWithItems } from '@/lib/data/menu'

export function MenuPageClient({ categories }: { categories: CategoryWithItems[] }) {
  const [active, setActive] = useState<string>(categories[0]?.id ?? '')

  const allItemEntries = categories.flatMap((c) =>
    c.items.map((i) => ({ id: i.id, scope: 'menu_item' as const })),
  )
  const categoryEntries = categories.map((c) => ({
    id: c.id,
    scope: 'menu_category' as const,
  }))

  const items = useTranslations(allItemEntries)
  const cats = useTranslations(categoryEntries)

  if (categories.length === 0) {
    return <p className="text-charcoal-soft text-center">התפריט יתעדכן בקרוב.</p>
  }

  return (
    <div>
      <div className="bg-cream/95 sm:border-charcoal/10 sticky top-16 z-20 -mx-4 mb-8 overflow-x-auto px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-full sm:border sm:px-2">
        <div className="flex w-max gap-2 sm:w-full sm:justify-center">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActive(c.id)
                document
                  .getElementById(c.id)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                active === c.id
                  ? 'bg-ketchup text-cream'
                  : 'text-charcoal hover:bg-cream-dark',
              )}
            >
              {cats.name(c.id, c.name_he)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-16">
        {categories.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-32">
            <h2 className="font-display mb-5 text-2xl">
              {cats.name(category.id, category.name_he)}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {category.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  name={items.name(item.id, item.name_he)}
                  description={items.description(item.id, item.description_he)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
