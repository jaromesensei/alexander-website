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
  return (
    <div className="border-ink/10 flex gap-4 border-b py-5">
      {item.image_url && (
        <div className="bg-paper-dark relative size-16 shrink-0 overflow-hidden sm:size-20">
          <Image src={item.image_url} alt={item.name_he} fill className="object-cover" />
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-bold">{name ?? item.name_he}</h3>
          <span className="text-pink shrink-0 font-bold">
            {formatCurrency(item.price_agorot)}
          </span>
        </div>
        {(description ?? item.description_he) && (
          <p className="text-ink-soft mt-1 text-sm">
            {description ?? item.description_he}
          </p>
        )}
        {item.tags.length > 0 && (
          <p className="label-caps text-turquoise mt-1.5 text-[10px]">
            {item.tags.join(' · ')}
          </p>
        )}
      </div>
    </div>
  )
}
