'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Accessibility, Minus, Plus, RotateCcw, X } from 'lucide-react'
import {
  A11Y_STORAGE_KEY,
  DEFAULT_PREFS,
  applyPrefs,
  type A11yPrefs,
} from '@/lib/a11yPrefs'
import { cn } from '@/lib/utils'

function load(): A11yPrefs {
  try {
    return {
      ...DEFAULT_PREFS,
      ...JSON.parse(localStorage.getItem(A11Y_STORAGE_KEY) ?? '{}'),
    }
  } catch {
    return DEFAULT_PREFS
  }
}

const TOGGLES = [
  { key: 'contrast', label: 'ניגודיות גבוהה' },
  { key: 'links', label: 'הדגשת קישורים' },
  { key: 'font', label: 'גופן קריא' },
  { key: 'noMotion', label: 'עצירת אנימציות' },
] as const

/**
 * תפריט נגישות מובנה (לא תוסף חיצוני). משלים את ההנגשה של האתר עצמו —
 * לא מחליף אותה: האתר עומד בדרישות גם בלי שום בחירה כאן.
 */
export function AccessibilityMenu() {
  const pathname = usePathname() ?? '/'
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<A11yPrefs>(DEFAULT_PREFS)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const titleId = useId()

  useEffect(() => {
    // ההעדפות כבר הוחלו ע"י סקריפט ה-head; כאן רק מסנכרנים את מצב הכפתורים
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefs(load())
  }, [])

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector('button')?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    function onClick(e: MouseEvent) {
      const t = e.target as Node
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t))
        setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  function update(next: A11yPrefs) {
    setPrefs(next)
    applyPrefs(next)
    try {
      localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // אחסון חסום — ההגדרה תחול רק לעמוד הנוכחי
    }
  }

  if (pathname.startsWith('/admin')) return null

  const changed = JSON.stringify(prefs) !== JSON.stringify(DEFAULT_PREFS)

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="תפריט נגישות"
        title="תפריט נגישות"
        className="bg-ink text-paper hover:bg-ink-soft fixed start-3 bottom-20 z-50 flex size-12 items-center justify-center rounded-full shadow-lg md:start-5 md:bottom-5"
      >
        <Accessibility className="size-6" aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="border-ink/15 fixed start-3 bottom-36 z-50 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border bg-white p-4 shadow-2xl md:start-5 md:bottom-20"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 id={titleId} className="text-lg">
              נגישות
            </h2>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                buttonRef.current?.focus()
              }}
              aria-label="סגירת תפריט הנגישות"
              className="hover:bg-paper-dark rounded-lg p-1.5"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="border-ink/10 mb-3 flex items-center justify-between rounded-xl border p-2">
            <span className="text-sm font-semibold" id={`${titleId}-size`}>
              גודל טקסט
            </span>
            <div
              className="flex items-center gap-1"
              role="group"
              aria-labelledby={`${titleId}-size`}
            >
              <button
                type="button"
                onClick={() => update({ ...prefs, text: Math.max(0, prefs.text - 1) })}
                disabled={prefs.text === 0}
                aria-label="הקטנת טקסט"
                className="hover:bg-paper-dark flex size-9 items-center justify-center rounded-lg disabled:opacity-40"
              >
                <Minus className="size-4" aria-hidden="true" />
              </button>
              <span className="w-12 text-center text-sm tabular-nums" aria-live="polite">
                {100 + prefs.text * 12.5}%
              </span>
              <button
                type="button"
                onClick={() => update({ ...prefs, text: Math.min(3, prefs.text + 1) })}
                disabled={prefs.text === 3}
                aria-label="הגדלת טקסט"
                className="hover:bg-paper-dark flex size-9 items-center justify-center rounded-lg disabled:opacity-40"
              >
                <Plus className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            {TOGGLES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                aria-pressed={prefs[key]}
                onClick={() => update({ ...prefs, [key]: !prefs[key] })}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-semibold',
                  prefs[key]
                    ? 'border-ink bg-ink text-paper'
                    : 'border-ink/15 hover:border-ink',
                )}
              >
                {label}
                <span aria-hidden="true">{prefs[key] ? 'פעיל' : ''}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => update(DEFAULT_PREFS)}
              disabled={!changed}
              className="hover:bg-paper-dark flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold disabled:opacity-40"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              איפוס
            </button>
            <Link
              href="/accessibility"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold underline underline-offset-4"
            >
              הצהרת נגישות
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
