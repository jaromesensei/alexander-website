'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Expand, X } from 'lucide-react'

/**
 * תמונת מנה בתפריט: תמונה גדולה ליד המנה, ולחיצה פותחת אותה במסך מלא.
 * נגיש: כפתור עם שם, Esc סוגר, הפוקוס נשאר בחלון וחוזר לתמונה בסגירה.
 */
export function DishImage({ src, name }: { src: string; name: string }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const trigger = triggerRef.current
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
      // בחלון יש רק כפתור סגירה — Tab נשאר עליו
      if (e.key === 'Tab') {
        e.preventDefault()
        closeRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      trigger?.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`הגדלת התמונה: ${name}`}
        className="group bg-paper-dark relative size-28 shrink-0 overflow-hidden sm:size-40"
      >
        <Image
          src={src}
          alt={name}
          fill
          sizes="(min-width: 640px) 160px, 112px"
          className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100"
        />
        <span className="bg-ink/70 text-paper absolute end-1.5 bottom-1.5 flex size-7 items-center justify-center rounded-full">
          <Expand className="size-3.5" aria-hidden="true" />
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={name}
          className="bg-ink/90 fixed inset-0 z-[80] flex flex-col items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="סגירה"
            className="bg-paper text-ink absolute end-4 top-4 flex size-11 items-center justify-center rounded-full"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
          <Image
            src={src}
            alt={name}
            width={1600}
            height={1600}
            sizes="(min-width: 768px) 80vw, 100vw"
            className="h-auto max-h-[80svh] w-auto max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="text-paper mt-4 text-center text-xl font-bold">{name}</p>
        </div>
      )}
    </>
  )
}
