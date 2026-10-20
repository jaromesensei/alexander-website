'use client'

import Image from 'next/image'
import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'
import { Carousel } from '@/components/ui/Carousel'
import { formatPriceRange } from '@/lib/format'
import type { MenuItem } from '@/types/db'

export interface DishCarouselTexts {
  prev: string
  next: string
  allCard: string
  menuLink: string
}

/** קרוסלת המנות המומלצות מהתפריט, עם כרטיס "לתפריט המלא" בסוף. */
export function DishCarousel({
  title,
  items,
  texts,
}: {
  title: string
  items: MenuItem[]
  texts: DishCarouselTexts
}) {
  return (
    <Carousel
      label={title}
      count={items.length + 1}
      prevLabel={texts.prev}
      nextLabel={texts.next}
      slideLabel={(i) => (i < items.length ? items[i].name_he : texts.menuLink)}
      renderSlide={(i) =>
        i < items.length ? (
          <DishCard item={items[i]} />
        ) : (
          <Link
            href="/menu"
            className="bg-ink text-paper flex aspect-[4/5] flex-col justify-end p-8"
          >
            <span className="font-display text-3xl leading-tight sm:text-4xl">
              {texts.allCard}
            </span>
            <span className="text-paper/80 mt-4 font-semibold underline underline-offset-4">
              {texts.menuLink}
            </span>
          </Link>
        )
      }
    />
  )
}

function DishCard({ item }: { item: MenuItem }) {
  return (
    <>
      <div className="bg-paper-dark relative aspect-[4/5] overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name_he}
            fill
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 78vw"
            className="object-cover"
          />
        ) : (
          <div className="text-ink-soft/30 flex h-full items-center justify-center">
            <UtensilsCrossed className="size-16" strokeWidth={1} aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="text-2xl leading-tight sm:text-3xl">
          <Link
            href={`/menu#dish-${item.id}`}
            className="hover:text-pink-dark transition-colors"
          >
            {item.name_he}
          </Link>
        </h3>
        <p className="shrink-0 text-xl font-bold tabular-nums">
          {formatPriceRange(item)}
        </p>
      </div>
      {item.description_he && (
        <p className="text-ink-soft mt-2 line-clamp-2">{item.description_he}</p>
      )}
    </>
  )
}
