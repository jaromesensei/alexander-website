'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { QUICK_LANGUAGES, labelForLang } from '@/lib/i18n/languages'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [customCode, setCustomCode] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function submitCustom(e: React.FormEvent) {
    e.preventDefault()
    const code = customCode.trim().toLowerCase().slice(0, 5)
    if (code) {
      setLang(code)
      setOpen(false)
      setCustomCode('')
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="border-charcoal/15 hover:bg-cream-dark flex h-10 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="size-4" />
        {labelForLang(lang)}
      </button>

      {open && (
        <div
          className="border-charcoal/10 absolute end-0 top-12 z-30 w-56 rounded-xl border bg-white p-2 shadow-lg"
          role="listbox"
        >
          {QUICK_LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLang(l.code)
                setOpen(false)
              }}
              className={cn(
                'hover:bg-cream-dark flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm',
                lang === l.code && 'font-bold',
              )}
              role="option"
              aria-selected={lang === l.code}
            >
              {l.label}
              {lang === l.code && <Check className="size-4" />}
            </button>
          ))}
          <form onSubmit={submitCustom} className="border-charcoal/10 mt-1 border-t pt-2">
            <label className="text-charcoal-soft block px-3 pb-1 text-xs">
              שפה אחרת (קוד, למשל de, it, zh)
            </label>
            <input
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="de"
              className="border-charcoal/15 mx-3 mb-2 h-9 w-[calc(100%-1.5rem)] rounded-lg border px-3 text-sm"
              dir="ltr"
            />
          </form>
        </div>
      )}
    </div>
  )
}
