'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, UtensilsCrossed } from 'lucide-react'
import { formatPriceRange } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { DishLayer, MenuItem } from '@/types/db'

export interface DishCarouselTexts {
  prev: string
  next: string
  allCard: string
  menuLink: string
}

/**
 * קרוסלת המנות המומלצות. גלילה טבעית של הדפדפן (scroll-snap) — החלקה באצבע,
 * חצים במחשב, נקודות למטה. בלי גלילה אוטומטית: לא בורחת למי שקורא, ואין צורך
 * בכפתור עצירה (WCAG 2.2.2).
 *
 * המנה שבמרכז "פעילה": אם יש לה שכבות (menu_items.layers) היא נפתחת למרכיבים.
 */
export function DishCarousel({
  title,
  items,
  texts,
}: {
  title: string
  items: MenuItem[]
  texts: DishCarouselTexts
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  // כל המנות + כרטיס "לתפריט המלא" בסוף
  const count = items.length + 1

  // הכרטיס הפעיל = זה שהמרכז שלו הכי קרוב למרכז הקרוסלה
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    let frame = 0
    function update() {
      frame = 0
      const box = scroller!.getBoundingClientRect()
      const center = box.left + box.width / 2
      let best = 0
      let bestDistance = Infinity
      Array.from(scroller!.children).forEach((card, i) => {
        const r = card.getBoundingClientRect()
        const distance = Math.abs(r.left + r.width / 2 - center)
        if (distance < bestDistance) {
          bestDistance = distance
          best = i
        }
      })
      setActive(best)
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    scroller.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      scroller.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  // scrollBy על הקרוסלה ולא scrollIntoView — שלא יזיז את הדף למעלה/למטה
  function goTo(index: number) {
    const scroller = scrollerRef.current
    const card = scroller?.children[index]
    if (!scroller || !card) return
    const box = scroller.getBoundingClientRect()
    const r = card.getBoundingClientRect()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scroller.scrollBy({
      left: r.left + r.width / 2 - (box.left + box.width / 2),
      behavior: reduce ? 'auto' : 'smooth',
    })
  }

  // רוחב ב-vw (הקרוסלה ברוחב המסך): אחוזים היו נמדדים מתוך הריפוד ומתכווצים.
  // הריפוד בצדדים = חצי ממה שנשאר, כך שגם הכרטיס הראשון והאחרון יכולים להיות במרכז
  const cardClass = 'w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:w-[min(32vw,26rem)]'

  return (
    <div role="region" aria-roledescription="קרוסלה" aria-label={title}>
      <div
        ref={scrollerRef}
        tabIndex={0}
        aria-label={title}
        className="flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto overscroll-x-contain px-[11vw] pt-2 pb-6 sm:gap-6 sm:px-[27vw] lg:px-[calc((100vw-min(32vw,26rem))/2)] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => {
          const isActive = i === active
          return (
            <article
              key={item.id}
              role="group"
              aria-roledescription="שקופית"
              aria-label={`${i + 1} / ${count}`}
              className={cardClass}
              // לחיצה או פוקוס על כרטיס בצד מביאים אותו למרכז (ולא מנווטים)
              onClickCapture={(e) => {
                if (isActive) return
                e.preventDefault()
                goTo(i)
              }}
              onFocus={() => !isActive && goTo(i)}
            >
              <div
                className={cn(
                  'transition-transform duration-300 ease-out motion-reduce:transition-none',
                  !isActive && 'scale-[0.92]',
                )}
              >
                <DishVisual item={item} open={isActive} />
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
              </div>
            </article>
          )
        })}

        <article
          role="group"
          aria-roledescription="שקופית"
          aria-label={`${count} / ${count}`}
          className={cardClass}
          onClickCapture={(e) => {
            if (active === count - 1) return
            e.preventDefault()
            goTo(count - 1)
          }}
          onFocus={() => active !== count - 1 && goTo(count - 1)}
        >
          <Link
            href="/menu"
            className={cn(
              'bg-ink text-paper flex aspect-square flex-col justify-end p-8 transition-transform duration-300 ease-out motion-reduce:transition-none',
              active !== count - 1 && 'scale-[0.92]',
            )}
          >
            <span className="font-display text-3xl leading-tight sm:text-4xl">
              {texts.allCard}
            </span>
            <span className="text-paper/80 mt-4 font-semibold underline underline-offset-4">
              {texts.menuLink}
            </span>
          </Link>
        </article>
      </div>

      <div className="flex items-center justify-center gap-4">
        <ArrowButton
          label={texts.prev}
          disabled={active === 0}
          onClick={() => goTo(active - 1)}
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </ArrowButton>
        <div className="flex items-center">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={i < items.length ? items[i].name_he : texts.menuLink}
              aria-current={i === active ? 'true' : undefined}
              className="flex size-6 items-center justify-center"
            >
              <span
                className={cn(
                  'block h-2 rounded-full transition-[width,background-color] duration-200 ease-out',
                  i === active ? 'bg-ink w-5' : 'bg-ink/25 w-2',
                )}
              />
            </button>
          ))}
        </div>
        <ArrowButton
          label={texts.next}
          disabled={active === count - 1}
          onClick={() => goTo(active + 1)}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </ArrowButton>
      </div>
    </div>
  )
}

function ArrowButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="border-ink/20 hover:border-ink hidden size-11 items-center justify-center rounded-full border transition-[border-color,transform] duration-150 ease-out active:scale-[0.97] disabled:opacity-30 sm:flex"
    >
      {children}
    </button>
  )
}

function DishVisual({ item, open }: { item: MenuItem; open: boolean }) {
  const layers = (item.layers ?? []).filter((l) => l.image_url)
  if (layers.length >= 2) return <LayeredDish layers={layers} open={open} />

  return (
    <div className="bg-paper-dark relative aspect-square overflow-hidden">
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
  )
}

/**
 * המנה בשכבות: כל שכבה היא תמונה ריבועית באותו גודל, המרכיב במרכז. סגורה —
 * השכבות צמודות (נראית כמו המנה); פתוחה — מתרחקות זו מזו ושם המרכיב מופיע לצידן.
 * רק transform ו-opacity, בפתיחה מדורג מלמעלה ובסגירה מהיר יותר.
 */
function LayeredDish({ layers, open }: { layers: DishLayer[]; open: boolean }) {
  const n = layers.length
  const middle = (n - 1) / 2
  // המרחק בין שכבות באחוזים מגובה השורה: צמוד כשסגור, מפוזר כשפתוח (לפי כמות השכבות)
  const closedGap = 7
  const openGap = Math.min(24, 100 / Math.max(1, n - 1))

  return (
    <div className="bg-paper-dark relative aspect-square overflow-hidden">
      <ul className="absolute inset-0">
        {layers.map((layer, i) => {
          const offset = (i - middle) * (open ? openGap : closedGap)
          return (
            <li
              key={i}
              className="absolute inset-x-0 top-[22%] h-[56%] transition-transform ease-out motion-reduce:transition-none"
              style={{
                zIndex: n - i,
                transform: `translateY(${offset}%)`,
                transitionDuration: open ? '600ms' : '300ms',
                transitionDelay: open ? `${i * 40}ms` : '0ms',
              }}
            >
              <div className="absolute inset-y-0 end-0 w-[72%]">
                <Image
                  src={layer.image_url}
                  alt=""
                  fill
                  sizes="25vw"
                  className="object-contain"
                />
              </div>
              {/* שם המרכיב עם קו מוביל — בצד ההתחלה, מופיע רק כשהמנה פתוחה */}
              <span
                className={cn(
                  'absolute start-3 top-1/2 flex w-[32%] -translate-y-1/2 items-center gap-1.5 text-xs font-bold transition-opacity ease-out sm:text-sm',
                  open ? 'opacity-100 duration-300' : 'opacity-0 duration-150',
                )}
                style={{ transitionDelay: open ? `${250 + i * 40}ms` : '0ms' }}
              >
                <span className="leading-tight">{layer.label}</span>
                <span aria-hidden="true" className="bg-ink/40 h-px flex-1" />
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
