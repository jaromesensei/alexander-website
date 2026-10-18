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
    return <p className="text-ink-soft text-center">התפריט יתעדכן בקרוב.</p>
  }

  return (
    <div>
      <div className="bg-paper/95 border-ink/10 sticky top-18 z-20 -mx-4 mb-12 overflow-x-auto border-b px-4 py-4 backdrop-blur sm:mx-0">
        <div className="flex w-max gap-6">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-current={active === c.id ? 'true' : undefined}
              onClick={() => {
                setActive(c.id)
                const reduce = window.matchMedia(
                  '(prefers-reduced-motion: reduce)',
                ).matches
                document
                  .getElementById(c.id)
                  ?.scrollIntoView({
                    behavior: reduce ? 'auto' : 'smooth',
                    block: 'start',
                  })
              }}
              className={cn(
                'shrink-0 border-b-2 pb-1 text-base font-semibold transition-colors',
                active === c.id
                  ? 'border-ink text-ink'
                  : 'text-ink-soft hover:text-ink border-transparent',
              )}
            >
              {cats.name(c.id, c.name_he)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl space-y-16">
        {categories.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-36">
            <h2 className="mb-2 text-3xl leading-tight sm:text-4xl">
              {cats.name(category.id, category.name_he)}
            </h2>
            <div>
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
