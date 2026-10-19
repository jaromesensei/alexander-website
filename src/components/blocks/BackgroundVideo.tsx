'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { prefersNoMotion } from '@/lib/a11yPrefs'
import { cn } from '@/lib/utils'

/** האם לא להפעיל וידאו: הפחתת תנועה (מערכת/תפריט הנגישות) או חיסכון בגלישה. */
function shouldSkip() {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection?.saveData
  return (
    prefersNoMotion() ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    Boolean(saveData)
  )
}

/**
 * וידאו רקע בלולאה, בלי קול. תמונת הרקע (אם יש) נשארת מתחתיו — היא מה שרואים
 * עד שהווידאו מתחיל, ובמקומו אצל מי שביקש להפחית תנועה (אז הווידאו לא נטען בכלל).
 *
 * נגישות (WCAG 2.2.2): תנועה שנמשכת יותר מ-5 שניות חייבת כפתור עצירה — בפינה
 * העליונה, כדי לא להתנגש בכפתורי הבלוק שיושבים למטה. מחוץ למסך הווידאו מושהה.
 */
export function BackgroundVideo({
  src,
  className,
  labels,
}: {
  src: string
  className?: string
  labels: { pause: string; play: string }
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [playing, setPlaying] = useState(false)
  // הופך ל-true בפריים הראשון ונשאר — כך גם וידאו מושהה נשאר גלוי
  const [started, setStarted] = useState(false)
  // עצירה ידנית גוברת על חזרה לתצוגה
  const [userPaused, setUserPaused] = useState(false)

  // הווידאו מוצג רק אחרי בדיקת ההעדפות בדפדפן, ונעלם אם הפעילו "עצירת אנימציות"
  useEffect(() => {
    const update = () => setEnabled(!shouldSkip())
    update()
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', update)
    const mo = new MutationObserver(update)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => {
      mq.removeEventListener('change', update)
      mo.disconnect()
    }
  }, [])

  useEffect(() => {
    const video = ref.current
    if (!enabled || !video || userPaused) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    io.observe(video)
    return () => io.disconnect()
  }, [enabled, userPaused])

  if (!enabled) return null

  function toggle() {
    const video = ref.current
    if (!video) return
    if (video.paused) {
      setUserPaused(false)
      video.play().catch(() => {})
    } else {
      setUserPaused(true)
      video.pause()
    }
  }

  return (
    <>
      <video
        ref={ref}
        src={src}
        aria-hidden="true"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        onPlaying={() => {
          setPlaying(true)
          setStarted(true)
        }}
        onPause={() => setPlaying(false)}
        className={cn(
          'absolute inset-0 size-full object-cover transition-opacity duration-500 ease-out',
          // מופיע רק כשהתחיל לרוץ — עד אז רואים את תמונת הרקע, בלי הבהוב של מסגרת ריקה
          started ? className : 'opacity-0',
        )}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? labels.pause : labels.play}
        className="bg-ink/70 text-paper hover:bg-ink absolute end-3 top-3 z-10 flex size-10 items-center justify-center rounded-full transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]"
      >
        {playing ? (
          <Pause className="size-4" aria-hidden="true" />
        ) : (
          <Play className="size-4" aria-hidden="true" />
        )}
      </button>
    </>
  )
}
