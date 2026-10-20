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
              'bg-ink text-paper flex aspect-[4/5] flex-col justify-end p-8 transition-transform duration-300 ease-out motion-reduce:transition-none',
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
  )
}

/** גבולות התוכן (לא השקוף) בתוך תמונת השכבה, כשבר מגובה התמונה */
interface LayerBounds {
  top: number
  bottom: number
}

const DEFAULT_BOUNDS: LayerBounds = { top: 0.35, bottom: 0.65 }

/**
 * מודד כמה גבוה המרכיב בכל שכבה (לפי השקיפות), כדי שהשכבות יישבו זו על זו כמו
 * במנה אמיתית — לחמנייה עבה, בצל דק — ולא במרווחים קבועים. ציור קטן (64px)
 * על canvas; אם התמונה לא ניתנת לקריאה, ברירת מחדל באמצע.
 */
function useLayerBounds(urls: string[]) {
  const key = urls.join('|')
  const [bounds, setBounds] = useState<LayerBounds[] | null>(null)

  useEffect(() => {
    let cancelled = false
    const size = 64
    Promise.all(
      urls.map(
        (url) =>
          new Promise<LayerBounds>((resolve) => {
            const img = new window.Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
              try {
                const canvas = document.createElement('canvas')
                canvas.width = canvas.height = size
                const ctx = canvas.getContext('2d')!
                ctx.drawImage(img, 0, 0, size, size)
                const data = ctx.getImageData(0, 0, size, size).data
                let first = -1
                let last = -1
                for (let y = 0; y < size; y++) {
                  for (let x = 0; x < size; x++) {
                    if (data[(y * size + x) * 4 + 3] > 40) {
                      if (first < 0) first = y
                      last = y
                      break
                    }
                  }
                }
                resolve(
                  first < 0
                    ? DEFAULT_BOUNDS
                    : { top: first / size, bottom: (last + 1) / size },
                )
              } catch {
                resolve(DEFAULT_BOUNDS)
              }
            }
            img.onerror = () => resolve(DEFAULT_BOUNDS)
            img.src = url
          }),
      ),
    ).then((result) => {
      if (!cancelled) setBounds(result)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return bounds
}

/** רוחב תמונת השכבה ביחס לרוחב הכרטיס, לפני הקטנה */
const LAYER_WIDTH = 0.72
/** כמה כל שכבה נכנסת בשכבה שמתחתיה כשהמנה סגורה (חלק מהגובה של הדקה מביניהן) */
const CLOSED_OVERLAP = 0.45
/** המרווח בין שכבות כשהמנה פתוחה, בחלקים מגובה הכרטיס */
const OPEN_GAP = 0.03

/** גובה הכרטיס ביחס לרוחבו (aspect-[4/5]) */
const BOX_HEIGHT = 5 / 4

/** מיקום כל שכבה והגודל שלה, במצב סגור או פתוח. כל המידות ביחידות של רוחב הכרטיס */
function stackLayout(bounds: LayerBounds[], open: boolean) {
  const heights = bounds.map((b) => (b.bottom - b.top) * LAYER_WIDTH)
  const overlaps = heights
    .slice(1)
    .map((h, i) => (open ? -OPEN_GAP : CLOSED_OVERLAP * Math.min(h, heights[i])))
  const sum = heights.reduce((a, b) => a + b, 0)
  const joined = sum - overlaps.reduce((a, b) => a + b, 0)
  // סגורה — המנה גדולה וממלאת את הכרטיס; פתוחה — קטנה מעט כדי שהכול ייכנס
  const target = (open ? 0.92 : 0.78) * BOX_HEIGHT
  const scale = Math.min(1.25, target / joined)
  let y = BOX_HEIGHT / 2 - (joined * scale) / 2
  return bounds.map((b, i) => {
    const contentTop = y
    y += heights[i] * scale - (overlaps[i] ?? 0) * scale
    return {
      scale,
      // הטרנספורם מתחיל מראש התמונה, לא מראש המרכיב
      imageTop: contentTop - b.top * LAYER_WIDTH * scale,
      center: contentTop + (heights[i] * scale) / 2,
    }
  })
}

/**
 * המנה בשכבות: כל שכבה היא תמונה ריבועית באותו גודל עם רקע שקוף. סגורה —
 * השכבות יושבות זו על זו (נראית כמו המנה); פתוחה — מתרחקות ושם המרכיב מופיע.
 * רק transform ו-opacity, בפתיחה מדורג מלמעלה ובסגירה מהיר יותר.
 */
function LayeredDish({ layers, open }: { layers: DishLayer[]; open: boolean }) {
  const n = layers.length
  const bounds = useLayerBounds(layers.map((l) => l.image_url))
  const ready = bounds !== null
  const layout = stackLayout(bounds ?? layers.map(() => DEFAULT_BOUNDS), open)
  const labels = stackLayout(bounds ?? layers.map(() => DEFAULT_BOUNDS), true)

  return (
    <div className="bg-paper-dark relative aspect-[4/5] overflow-hidden">
      <ul
        className={cn(
          'absolute inset-0 transition-opacity duration-300 ease-out',
          !ready && 'opacity-0',
        )}
      >
        {layers.map((layer, i) => (
          <li key={i}>
            <div
              className="absolute end-0 top-0 aspect-square origin-top transition-transform ease-out motion-reduce:transition-none"
              style={{
                width: `${LAYER_WIDTH * 100}%`,
                zIndex: n - i,
                // אחוזים ב-translateY = מגובה התמונה (= LAYER_WIDTH מרוחב הכרטיס)
                transform: `translateY(${(layout[i].imageTop / LAYER_WIDTH) * 100}%) scale(${layout[i].scale})`,
                transitionDuration: open ? '650ms' : '300ms',
                transitionDelay: open ? `${i * 40}ms` : '0ms',
              }}
            >
              <Image
                src={layer.image_url}
                alt=""
                fill
                sizes="30vw"
                className="object-contain"
              />
            </div>
            {/* שם המרכיב עם קו מוביל — בצד ההתחלה, ליד המרכיב, רק כשהמנה פתוחה */}
            <span
              className={cn(
                'absolute start-3 flex w-[30%] -translate-y-1/2 items-center gap-1.5 text-xs font-bold transition-opacity ease-out sm:text-sm',
                open && ready ? 'opacity-100 duration-300' : 'opacity-0 duration-150',
              )}
              style={{
                top: `${(labels[i].center / BOX_HEIGHT) * 100}%`,
                transitionDelay: open ? `${300 + i * 40}ms` : '0ms',
              }}
            >
              <span className="leading-tight">{layer.label}</span>
              <span aria-hidden="true" className="bg-ink/40 h-px flex-1" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
