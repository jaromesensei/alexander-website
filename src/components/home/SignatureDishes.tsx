'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowUpLeft, UtensilsCrossed } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { formatCurrency } from '@/lib/format'
import type { CategoryWithItems } from '@/lib/data/menu'
import type { MenuItem } from '@/types/db'

export function SignatureDishes({ categories }: { categories: CategoryWithItems[] }) {
  const featured = categories
    .flatMap((c) => c.items.filter((i) => i.is_featured))
    .slice(0, 4)
  if (featured.length === 0) return null

  return (
    <section id="signature" className="py-20 sm:py-32">
      <Container className="mb-16">
        <Reveal>
          <p className="label-caps text-pink mb-3 text-xs">מהמטבח שלנו</p>
          <h2 className="font-display text-4xl leading-[0.95] sm:text-7xl">
            המנות שמדברות
            <br />
            בעד עצמן
          </h2>
        </Reveal>
      </Container>

      <div className="space-y-24 sm:space-y-36">
        {featured.map((item, i) => (
          <DishRow key={item.id} item={item} index={i} reversed={i % 2 === 1} />
        ))}
      </div>
    </section>
  )
}

function DishRow({
  item,
  index,
  reversed,
}: {
  item: MenuItem
  index: number
  reversed: boolean
}) {
  return (
    <Container>
      <div
        className={`grid items-center gap-8 sm:grid-cols-2 sm:gap-16 ${
          reversed ? 'sm:[&>*:first-child]:order-2' : ''
        }`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-paper-dark relative aspect-4/5 overflow-hidden"
        >
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name_he}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="text-ink-soft/30 flex h-full items-center justify-center">
              <UtensilsCrossed className="size-16" strokeWidth={1} />
            </div>
          )}
        </motion.div>

        <Reveal>
          <p className="label-caps text-ink-soft mb-4 text-xs">
            {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="font-display text-4xl leading-[0.95] sm:text-6xl">
            {item.name_he}
          </h3>
          {item.description_he && (
            <p className="text-ink-soft mt-5 max-w-sm text-lg">{item.description_he}</p>
          )}
          <div className="mt-6 flex items-center gap-6">
            <span className="font-display text-pink text-3xl">
              {formatCurrency(item.price_agorot)}
            </span>
            <Link
              href="/menu"
              className="label-caps group flex items-center gap-2 text-xs"
            >
              לתפריט המלא
              <ArrowUpLeft className="size-4 transition-transform group-hover:translate-x-[-2px] group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </Container>
  )
}
