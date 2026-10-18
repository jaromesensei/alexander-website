'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { SiteMotion } from '@/components/a11y/SiteMotion'
import { isPopupLive, placementMatches, zonedNow } from '@/lib/popups/schedule'
import { alreadySeen, markSeen } from '@/lib/popups/seen'
import { PopupCard } from './PopupCard'
import type { Popup, RestaurantSettings } from '@/types/db'

/**
 * בוחר את החלון הקופץ שמתאים לרגע הזה (לפי שעון ישראל) ומציג אותו אחרי
 * ההשהיה שהוגדרה. ההחלטה בדפדפן — כך הדפים נשארים סטטיים ומהירים, והתזמון
 * מדויק לרגע הכניסה ולא לרגע שבו הדף נבנה.
 */
export function PopupManager({
  popups,
  settings,
}: {
  popups: Popup[]
  settings: RestaurantSettings
}) {
  const pathname = usePathname() ?? '/'
  const [current, setCurrent] = useState<Popup | null>(null)
  const titleId = useId()
  const closeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pathname.startsWith('/admin') || popups.length === 0) return
    const now = zonedNow()
    const candidate = popups
      .filter(
        (p) =>
          placementMatches(p.placement, pathname) &&
          isPopupLive(p, now) &&
          !alreadySeen(p, now),
      )
      .sort((a, b) => a.sort_order - b.sort_order)[0]
    if (!candidate) return

    const timer = window.setTimeout(() => {
      markSeen(candidate, now)
      setCurrent(candidate)
    }, candidate.delay_seconds * 1000)
    return () => window.clearTimeout(timer)
  }, [pathname, popups])

  // נגישות: פוקוס עובר לחלון, Tab נשאר בתוכו, Esc סוגר, ובסגירה הפוקוס חוזר למקומו
  useEffect(() => {
    if (!current) return
    const previous = document.activeElement as HTMLElement | null
    const dialog = closeRef.current
    dialog?.querySelector('button')?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setCurrent(null)
        return
      }
      if (e.key !== 'Tab' || !dialog) return
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [current])

  return (
    <SiteMotion>
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            className="bg-ink/60 fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCurrent(null)}
          >
            <motion.div
              ref={closeRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="flex w-full justify-center"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <PopupCard
                popup={current}
                settings={settings}
                titleId={titleId}
                onClose={() => setCurrent(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SiteMotion>
  )
}
