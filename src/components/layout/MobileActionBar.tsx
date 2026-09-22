'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  UtensilsCrossed,
  MessageCircle,
  Phone,
  Navigation,
  type LucideIcon,
} from 'lucide-react'
import { waLink, WA_MESSAGES } from '@/lib/whatsapp'
import type { RestaurantSettings } from '@/types/db'

interface Action {
  href: string | null
  label: string
  icon: LucideIcon
  external?: boolean
}

export function MobileActionBar({ settings }: { settings: RestaurantSettings }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  const wazeHref =
    settings.lat && settings.lng
      ? `https://waze.com/ul?ll=${settings.lat},${settings.lng}&navigate=yes`
      : settings.map_url

  const actions = [
    { href: '/menu', label: 'תפריט', icon: UtensilsCrossed },
    {
      href: waLink(settings.whatsapp, WA_MESSAGES.reservation) ?? `tel:${settings.phone}`,
      label: 'הזמנה',
      icon: MessageCircle,
      external: true,
    },
    { href: `tel:${settings.phone}`, label: 'התקשרות', icon: Phone, external: true },
    { href: wazeHref, label: 'וייז', icon: Navigation, external: true },
  ].filter((a): a is Action & { href: string } => Boolean(a.href))

  return (
    <nav className="border-ink/10 bg-paper/95 fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t backdrop-blur md:hidden">
      {actions.map(({ href, label, icon: Icon, external }) => (
        <Link
          key={label}
          href={href}
          target={external ? '_blank' : undefined}
          className="text-ink active:text-pink flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold"
        >
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
