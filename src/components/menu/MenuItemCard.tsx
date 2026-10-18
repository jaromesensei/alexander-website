import { formatCurrency } from '@/lib/format'
import { HighlightTags, DietTags } from './MenuTags'
import { DishImage } from './DishImage'
import type { MenuItem } from '@/types/db'

export function MenuItemCard({
  item,
  name,
  description,
  tagLabel,
}: {
  item: MenuItem
  name?: string
  description?: string | null
  tagLabel?: (key: string, fallback: string) => string
}) {
  const text = description ?? item.description_he
  const title = name ?? item.name_he

  return (
    <div className="border-ink/10 flex gap-4 border-b py-5 sm:gap-6">
      {item.image_url && <DishImage src={item.image_url} name={title} />}

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <span className="shrink-0 text-lg font-bold tabular-nums">
            {formatCurrency(item.price_agorot)}
          </span>
        </div>
        <HighlightTags tags={item.tags} label={tagLabel} className="mt-1.5" />
        {text && <p className="text-ink-soft mt-1.5">{text}</p>}
        <DietTags tags={item.tags} label={tagLabel} className="mt-2" />
      </div>
    </div>
  )
}
