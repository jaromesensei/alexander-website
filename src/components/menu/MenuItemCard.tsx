import Image from 'next/image'
import { UtensilsCrossed } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
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
    <Card className="flex gap-4 overflow-hidden p-4 sm:p-5">
      <div className="bg-cream-dark relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:size-24">
        {item.image_url ? (
          <Image src={item.image_url} alt={item.name_he} fill className="object-cover" />
        ) : (
          <UtensilsCrossed className="text-charcoal/30 size-7" />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-tight">{name ?? item.name_he}</h3>
          <span className="font-display text-ketchup shrink-0 text-lg">
            {formatCurrency(item.price_agorot)}
          </span>
        </div>
        {(description ?? item.description_he) && (
          <p className="text-charcoal-soft mt-1 text-sm">
            {description ?? item.description_he}
          </p>
        )}
        {item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} tone="forest">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
