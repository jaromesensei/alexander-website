'use client'

import { usePathname } from 'next/navigation'
import { PREVIEW_PATH } from '@/lib/blocks/previewProtocol'
import Link from 'next/link'
import {
  UtensilsCrossed,
  MessageCircle,
  Phone,
  Navigation,
  Accessibility,
  type LucideIcon,
} from 'lucide-react'
import { waHref } from '@/lib/links'
import { siteText } from '@/lib/siteTexts'
import { NewTabHint } from '@/components/a11y/NewTabHint'
import { OPEN_A11Y_EVENT } from '@/components/a11y/AccessibilityMenu'
import type { RestaurantSettings } from '@/types/db'

interface Action {
  href: string | null
  label: string
  icon: LucideIcon
  external?: boolean
}

const ITEM =
  'text-ink active:text-pink-dark flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-transform duration-150 ease-out active:scale-[0.97]'

export function MobileActionBar({ settings }: { settings: RestaurantSettings }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin') && pathname !== PREVIEW_PATH) return null
  // תפריט הנגישות לא נטען בתצוגה המקדימה של העורך
  const showA11y = pathname !== PREVIEW_PATH

  const wazeHref =
    settings.lat && settings.lng
      ? `https://waze.com/ul?ll=${settings.lat},${settings.lng}&navigate=yes`
      : settings.map_url

  const actions = [
    { href: '/menu', label: siteText(settings, 'mobile.menu'), icon: UtensilsCrossed },
    {
      href: waHref(settings, 'reservation'),
      label: siteText(settings, 'mobile.reserve'),
      icon: MessageCircle,
      external: true,
    },
    {
      href: `tel:${settings.phone}`,
      label: siteText(settings, 'mobile.call'),
      icon: Phone,
    },
    {
      href: wazeHref,
      label: siteText(settings, 'mobile.waze'),
      icon: Navigation,
      external: true,
    },
  ].filter((a): a is Action & { href: string } => Boolean(a.href))

  return (
    <nav
      aria-label="פעולות מהירות"
      className="border-ink/10 bg-paper/95 fixed inset-x-0 bottom-0 z-40 flex border-t backdrop-blur md:hidden"
    >
      {actions.map(({ href, label, icon: Icon, external }) => (
        <Link
          key={label}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          className={ITEM}
        >
          <Icon className="size-5" aria-hidden="true" />
          {label}
          {external && <NewTabHint />}
        </Link>
      ))}
      {showA11y && (
        <button
          type="button"
          onClick={(e) =>
            window.dispatchEvent(
              new CustomEvent(OPEN_A11Y_EVENT, { detail: e.currentTarget }),
            )
          }
          aria-haspopup="dialog"
          className={ITEM}
        >
          <Accessibility className="size-5" aria-hidden="true" />
          {siteText(settings, 'mobile.a11y')}
        </button>
      )}
    </nav>
  )
}
