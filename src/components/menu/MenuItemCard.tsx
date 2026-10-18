import { formatCurrency, formatPriceRange } from '@/lib/format'
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
  // רשימת הגדלים מוצגת רק כשיש להם שמות; בלי שמות מספיק הטווח שליד שם המנה
  const variants = (item.price_variants ?? []).filter((v) => v.label.trim())

  return (
    <div className="border-ink/10 flex gap-4 border-b py-5 sm:gap-6">
      {item.image_url && <DishImage src={item.image_url} name={title} />}

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <span className="shrink-0 text-lg font-bold tabular-nums">
            {formatPriceRange(item)}
          </span>
        </div>
        <HighlightTags tags={item.tags} label={tagLabel} className="mt-1.5" />
        {text && <p className="text-ink-soft mt-1.5">{text}</p>}
        {variants.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {variants.map((v) => (
              <li key={v.label + v.price_agorot} className="flex items-baseline gap-1.5">
                <span className="text-ink-soft text-sm">{v.label}</span>
                <span className="font-bold tabular-nums">
                  {formatCurrency(v.price_agorot)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <DietTags tags={item.tags} label={tagLabel} className="mt-2" />
      </div>
    </div>
  )
}
