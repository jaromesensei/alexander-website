'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { navItems } from './navItems'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="border-charcoal/10 bg-cream/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-ketchup text-2xl">
          אלכסנדר
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'hover:text-ketchup text-sm font-semibold transition-colors',
                pathname === item.href ? 'text-ketchup' : 'text-charcoal',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <ButtonLink href="/reservations" size="sm">
            הזמנת שולחן
          </ButtonLink>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-charcoal/10 bg-cream border-t px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block rounded-lg px-3 py-2.5 text-base font-semibold',
                    pathname === item.href
                      ? 'bg-ketchup/10 text-ketchup'
                      : 'text-charcoal',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-3">
            <LanguageSwitcher />
            <ButtonLink href="/reservations" size="sm" onClick={() => setOpen(false)}>
              הזמנת שולחן
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  )
}
