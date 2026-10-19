'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NewTabHint } from '@/components/a11y/NewTabHint'
import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { resolveHref, waHref } from '@/lib/links'
import { siteText } from '@/lib/siteTexts'
import type { NavItem, RestaurantSettings } from '@/types/db'

export function Header({
  settings,
  nav,
}: {
  settings: RestaurantSettings
  nav: NavItem[]
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Esc סוגר את תפריט המובייל ומחזיר את הפוקוס לכפתור שפתח אותו
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  const reserveHref = waHref(settings, 'reservation')
  const reserveLabel = siteText(settings, 'header.reserve')
  const links = nav.flatMap((item) => {
    const r = resolveHref(item.href, settings)
    return r ? [{ ...r, label: item.label }] : []
  })

  // קישורי עוגן (עם #) לא מקבלים מצב "פעיל" — אין דרך זולה לדעת איזו סקשן בתצוגה כרגע.
  function isActive(href: string) {
    return !href.includes('#') && pathname === href
  }

  return (
    <header className="border-ink/10 bg-paper/95 sticky top-0 z-40 border-b backdrop-blur">
      <a
        href="#main"
        className="bg-ink text-paper sr-only z-[100] px-4 py-3 font-bold focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        דילוג לתוכן הראשי
      </a>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-wordmark text-2xl leading-none sm:text-3xl">
          <span lang="en">Alexander</span>
          <span className="sr-only"> — עמוד הבית</span>
        </Link>

        <nav aria-label="ניווט ראשי" className="hidden items-center gap-8 md:flex">
          {links.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'text-ink hover:text-pink-dark text-[15px] font-semibold underline-offset-8 transition-colors',
                isActive(item.href) && 'decoration-ink underline decoration-2',
              )}
            >
              {item.label}
              {item.external && <NewTabHint />}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <ButtonLink href={reserveHref} target="_blank" size="sm">
            {reserveLabel}
          </ButtonLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="flex size-11 items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="תפריט ניווט"
          className="border-ink/10 bg-paper drop-in border-t px-4 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {links.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'block px-3 py-3 text-lg font-semibold',
                    isActive(item.href) ? 'bg-paper-dark' : 'text-ink',
                  )}
                >
                  {item.label}
                  {item.external && <NewTabHint />}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-3">
            <LanguageSwitcher />
            <ButtonLink
              href={reserveHref}
              target="_blank"
              size="sm"
              onClick={() => setOpen(false)}
            >
              {reserveLabel}
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  )
}
