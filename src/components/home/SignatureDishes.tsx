import Image from 'next/image'
import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import type { CategoryWithItems } from '@/lib/data/menu'
import type { MenuItem } from '@/types/db'

export function SignatureDishes({ categories }: { categories: CategoryWithItems[] }) {
  const featured = categories
    .flatMap((c) => c.items.filter((i) => i.is_featured))
    .slice(0, 4)
  if (featured.length === 0) return null

  return (
    <section id="signature" className="py-20 sm:py-28">
      <Container>
        <h2 className="mb-14 text-4xl leading-tight sm:text-5xl">המנות שבשבילן באים</h2>
        <div className="space-y-20 sm:space-y-28">
          {featured.map((item, i) => (
            <DishRow key={item.id} item={item} reversed={i % 2 === 1} />
          ))}
        </div>
      </Container>
    </section>
  )
}

function DishRow({ item, reversed }: { item: MenuItem; reversed: boolean }) {
  return (
    <article className="grid items-center gap-8 sm:grid-cols-2 sm:gap-16">
      <div
        className={cn(
          'bg-paper-dark relative aspect-4/5 overflow-hidden',
          reversed && 'sm:order-2',
        )}
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name_he}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 hover:scale-105 motion-reduce:hover:scale-100"
          />
        ) : (
          <div className="text-ink-soft/30 flex h-full items-center justify-center">
            <UtensilsCrossed className="size-16" strokeWidth={1} />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-3xl leading-tight sm:text-4xl">{item.name_he}</h3>
        {item.description_he && (
          <p className="text-ink-soft mt-4 max-w-sm text-lg">{item.description_he}</p>
        )}
        <p className="mt-6 text-2xl font-bold tabular-nums">
          {formatCurrency(item.price_agorot)}
        </p>
        <Link
          href="/menu"
          className="text-pink hover:text-pink-dark mt-4 inline-block font-semibold underline underline-offset-4"
        >
          לתפריט המלא
        </Link>
      </div>
    </article>
  )
}
