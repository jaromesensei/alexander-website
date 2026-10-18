'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { waLink, WA_MESSAGES } from '@/lib/whatsapp'
import { resolveHref } from '@/lib/links'
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
  const reserveHref =
    waLink(settings.whatsapp, WA_MESSAGES.reservation) ?? `tel:${settings.phone}`
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
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-wordmark text-2xl leading-none sm:text-3xl">
          Alexander
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'text-ink hover:text-pink text-[15px] font-semibold underline-offset-8 transition-colors',
                isActive(item.href) && 'decoration-ink underline decoration-2',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <ButtonLink href={reserveHref} target="_blank" size="sm">
            הזמנת שולחן
          </ButtonLink>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-ink/10 bg-paper border-t px-4 py-4 md:hidden">
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
              הזמנת שולחן
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  )
}
