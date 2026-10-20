'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * קרוסלה כללית: גלילה טבעית של הדפדפן (scroll-snap) — החלקה באצבע, חצים במחשב,
 * נקודות למטה. בלי גלילה אוטומטית: לא בורחת למי שקורא, ואין צורך בכפתור עצירה
 * (WCAG 2.2.2). הכרטיס שבמרכז "פעיל" — renderSlide מקבל את זה ויכול להגיב (למשל
 * לפתוח תמונה לשכבות). כרטיסים בצדדים מוקטנים מעט; לחיצה עליהם מביאה אותם למרכז.
 */
export function Carousel({
  label,
  count,
  renderSlide,
  slideLabel,
  prevLabel,
  nextLabel,
}: {
  /** שם הקרוסלה לקוראי מסך (בדרך כלל הכותרת שמעליה) */
  label: string
  count: number
  renderSlide: (index: number, active: boolean) => React.ReactNode
  /** שם כל כרטיס — לנקודות הניווט */
  slideLabel: (index: number) => string
  prevLabel: string
  nextLabel: string
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

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
  }, [count])

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

  return (
    <div role="region" aria-roledescription="קרוסלה" aria-label={label}>
      {/* רוחב ב-vw (הקרוסלה ברוחב המסך): אחוזים היו נמדדים מתוך הריפוד ומתכווצים.
          הריפוד בצדדים = חצי ממה שנשאר, כך שגם הכרטיס הראשון והאחרון יכולים להיות במרכז */}
      <div
        ref={scrollerRef}
        tabIndex={0}
        aria-label={label}
        className="flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto overscroll-x-contain px-[11vw] pt-2 pb-6 sm:gap-6 sm:px-[27vw] lg:px-[calc((100vw-min(32vw,26rem))/2)] [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: count }, (_, i) => {
          const isActive = i === active
          return (
            <article
              key={i}
              role="group"
              aria-roledescription="שקופית"
              aria-label={`${i + 1} / ${count}`}
              className="w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:w-[min(32vw,26rem)]"
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
                {renderSlide(i, isActive)}
              </div>
            </article>
          )
        })}
      </div>

      {count > 1 && (
        <div className="flex items-center justify-center gap-4">
          <ArrowButton
            label={prevLabel}
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
                aria-label={slideLabel(i)}
                aria-current={i === active ? 'true' : undefined}
                className="flex size-6 items-center justify-center"
              >
                <span
                  className={cn(
                    'block h-2 rounded-full transition-[width,background-color] duration-200 ease-out',
                    i === active ? 'w-5 bg-current' : 'w-2 bg-current opacity-25',
                  )}
                />
              </button>
            ))}
          </div>
          <ArrowButton
            label={nextLabel}
            disabled={active === count - 1}
            onClick={() => goTo(active + 1)}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </ArrowButton>
        </div>
      )}
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
      className="hidden size-11 items-center justify-center rounded-full border border-current/25 transition-[border-color,transform] duration-150 ease-out hover:border-current active:scale-[0.97] disabled:opacity-30 sm:flex"
    >
      {children}
    </button>
  )
}
