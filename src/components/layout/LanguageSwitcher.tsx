'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { QUICK_LANGUAGES, dirForLang, labelForLang } from '@/lib/i18n/languages'
import { cn } from '@/lib/utils'

/**
 * בורר שפה כ-disclosure נגיש: כפתור שפותח קבוצת כפתורים. Esc סוגר ומחזיר
 * פוקוס לכפתור; יציאת פוקוס מהפאנל סוגרת אותו. כל שם שפה מסומן ב-lang שלו.
 */
export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [customCode, setCustomCode] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const inputId = useId()

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function choose(code: string) {
    setLang(code)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function submitCustom(e: React.FormEvent) {
    e.preventDefault()
    const code = customCode
      .trim()
      .toLowerCase()
      .replace(/[^a-z-]/g, '')
      .slice(0, 5)
    if (code) {
      setCustomCode('')
      choose(code)
    }
  }

  return (
    <div
      className="relative"
      ref={ref}
      onBlur={(e) => {
        if (open && !e.currentTarget.contains(e.relatedTarget as Node | null))
          setOpen(false)
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="border-ink/15 hover:bg-paper-dark flex h-10 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <Globe className="size-4" aria-hidden="true" />
        <span className="sr-only">שפת התפריט: </span>
        <span lang={lang}>{labelForLang(lang)}</span>
      </button>

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label="בחירת שפה"
          className="border-ink/10 pop-in absolute end-0 top-12 z-30 max-h-[70svh] w-56 origin-top-left overflow-y-auto rounded-xl border bg-white p-2 shadow-lg"
        >
          {QUICK_LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => choose(l.code)}
              aria-current={lang === l.code ? 'true' : undefined}
              className={cn(
                'hover:bg-paper-dark flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm',
                lang === l.code && 'font-bold',
              )}
            >
              <span lang={l.code} dir={dirForLang(l.code)}>
                {l.label}
              </span>
              {lang === l.code && <Check className="size-4" aria-hidden="true" />}
            </button>
          ))}
          <form
            onSubmit={submitCustom}
            className="border-ink/10 mt-1 border-t px-3 pt-2 pb-1"
          >
            <label htmlFor={inputId} className="text-ink-soft block pb-1 text-xs">
              שפה אחרת? הקלידו את קוד השפה (למשל pt)
            </label>
            <div className="flex gap-1.5">
              <input
                id={inputId}
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="pt"
                autoComplete="off"
                className="border-ink/30 h-9 min-w-0 flex-1 rounded-lg border px-3 text-sm"
                dir="ltr"
              />
              <button
                type="submit"
                className="bg-ink text-paper h-9 shrink-0 rounded-lg px-3 text-sm font-semibold"
              >
                החלפה
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
