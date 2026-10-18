import Image from 'next/image'
import { formatCurrency } from '@/lib/format'
import type { MenuItem } from '@/types/db'

export function MenuItemCard({
  item,
  name,
  description,
}: {
  item: MenuItem
  name?: string
  description?: string | null
}) {
  const text = description ?? item.description_he

  return (
    <div className="border-ink/10 flex gap-4 border-b py-5">
      {item.image_url && (
        <div className="bg-paper-dark relative size-20 shrink-0 overflow-hidden">
          <Image
            src={item.image_url}
            alt={item.name_he}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-bold">{name ?? item.name_he}</h3>
          <span className="shrink-0 text-lg font-bold tabular-nums">
            {formatCurrency(item.price_agorot)}
          </span>
        </div>
        {text && <p className="text-ink-soft mt-1">{text}</p>}
        {item.tags.length > 0 && (
          <p className="text-ink-soft mt-1 text-sm">{item.tags.join(', ')}</p>
        )}
      </div>
    </div>
  )
}
