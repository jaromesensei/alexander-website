'use client'

import { useEffect, useId, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SiteMotion } from '@/components/a11y/SiteMotion'
import { PopupCard } from './PopupCard'
import type { Popup, RestaurantSettings } from '@/types/db'

/**
 * החלון עצמו, עם האנימציה. נטען בנפרד (next/dynamic ב-PopupManager) — כך
 * ספריית motion לא יורדת בכל עמוד, רק כשבאמת יש חלון להציג.
 */
export default function PopupDialog({
  popup,
  settings,
  onClose,
}: {
  popup: Popup | null
  settings: RestaurantSettings
  onClose: () => void
}) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  // נגישות: פוקוס עובר לחלון, Tab נשאר בתוכו, Esc סוגר, ובסגירה הפוקוס חוזר למקומו
  useEffect(() => {
    if (!popup) return
    const previous = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    dialog?.querySelector('button')?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
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
  }, [popup, onClose])

  return (
    <SiteMotion>
      <AnimatePresence>
        {popup && (
          <motion.div
            key={popup.id}
            className="bg-ink/60 fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeOut' } }}
            onClick={onClose}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="flex w-full justify-center"
              // transform כמחרוזת (לא y) — רץ על ה-GPU גם כשהדף עסוק בטעינה.
              // יציאה מהירה מהכניסה: סגירה צריכה להרגיש מיידית
              initial={{ transform: 'translateY(40px)' }}
              animate={{
                transform: 'translateY(0px)',
                transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
              }}
              exit={{
                transform: 'translateY(16px)',
                transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <PopupCard
                popup={popup}
                settings={settings}
                titleId={titleId}
                onClose={onClose}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SiteMotion>
  )
}
