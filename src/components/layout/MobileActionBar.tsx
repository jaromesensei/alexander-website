'use client'

import { usePathname } from 'next/navigation'
import { PREVIEW_PATH } from '@/lib/blocks/previewProtocol'
import Link from 'next/link'
import {
  UtensilsCrossed,
  MessageCircle,
  Phone,
  Navigation,
  type LucideIcon,
} from 'lucide-react'
import { waHref } from '@/lib/links'
import { siteText } from '@/lib/siteTexts'
import { NewTabHint } from '@/components/a11y/NewTabHint'
import type { RestaurantSettings } from '@/types/db'

interface Action {
  href: string | null
  label: string
  icon: LucideIcon
  external?: boolean
}

export function MobileActionBar({ settings }: { settings: RestaurantSettings }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin') && pathname !== PREVIEW_PATH) return null

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
      className="border-ink/10 bg-paper/95 fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t backdrop-blur md:hidden"
    >
      {actions.map(({ href, label, icon: Icon, external }) => (
        <Link
          key={label}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          className="text-ink active:text-pink-dark flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold"
        >
          <Icon className="size-5" aria-hidden="true" />
          {label}
          {external && <NewTabHint />}
        </Link>
      ))}
    </nav>
  )
}
