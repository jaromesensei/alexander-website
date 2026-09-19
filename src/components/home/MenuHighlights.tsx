'use client'

import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeading } from '@/components/ui/Section'
import { MenuItemCard } from '@/components/menu/MenuItemCard'
import { useTranslations } from '@/lib/i18n/useTranslations'
import type { CategoryWithItems } from '@/lib/data/menu'

export function MenuHighlights({ categories }: { categories: CategoryWithItems[] }) {
  const featured = categories
    .flatMap((c) => c.items.filter((i) => i.is_featured))
    .slice(0, 4)
  const { name, description } = useTranslations(
    featured.map((item) => ({ id: item.id, scope: 'menu_item' as const })),
  )

  if (featured.length === 0) return null

  return (
    <Section>
      <SectionHeading eyebrow="מהתפריט" title="המנות שאוהבים אצלנו הכי הרבה" />
      <div className="grid gap-4 sm:grid-cols-2">
        {featured.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            name={name(item.id, item.name_he)}
            description={description(item.id, item.description_he)}
          />
        ))}
      </div>
      <div className="mt-10 text-center">
        <ButtonLink href="/menu" variant="outline">
          לתפריט המלא
        </ButtonLink>
      </div>
    </Section>
  )
}
