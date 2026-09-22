import Link from 'next/link'
import { Phone, MapPin, Clock } from 'lucide-react'
import { InstagramIcon, FacebookIcon } from '@/components/icons/SocialIcons'
import { HOURS_LABELS } from '@/lib/data/fallback'
import { Container } from '@/components/ui/Container'
import { formatTime } from '@/lib/format'
import { navItems } from './navItems'
import type { RestaurantSettings } from '@/types/db'

export function Footer({ settings }: { settings: RestaurantSettings }) {
  return (
    <footer className="border-ink/10 bg-ink text-paper relative overflow-hidden border-t">
      <Container className="pt-16 pb-10">
        <p className="font-wordmark text-6xl sm:text-9xl">Alexander</p>
      </Container>

      <Container className="grid gap-10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          {settings.tagline && (
            <p className="text-paper/70 text-sm leading-relaxed">{settings.tagline}</p>
          )}
          <div className="mt-4 flex gap-3">
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="bg-paper/10 hover:bg-pink flex size-9 items-center justify-center rounded-full transition-colors"
                aria-label="אינסטגרם"
              >
                <InstagramIcon className="size-4" />
              </a>
            )}
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="bg-paper/10 hover:bg-pink flex size-9 items-center justify-center rounded-full transition-colors"
                aria-label="פייסבוק"
              >
                <FacebookIcon className="size-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="label-caps text-pink mb-3 text-xs">ניווט</p>
          <ul className="text-paper/80 space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-caps text-pink mb-3 text-xs">יצירת קשר</p>
          <ul className="text-paper/80 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-paper" dir="ltr">
                {settings.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>{settings.address}</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="label-caps text-pink mb-3 flex items-center gap-2 text-xs">
            <Clock className="size-4" />
            שעות פתיחה
          </p>
          <ul className="text-paper/80 space-y-1 text-sm">
            {HOURS_LABELS.map((label, i) => {
              const h = settings.hours[String(i)]
              return (
                <li key={i} className="flex justify-between gap-4">
                  <span>{label}</span>
                  <span dir="ltr">
                    {h ? `${formatTime(h.open)}–${formatTime(h.close)}` : 'סגור'}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>

      <div className="border-paper/10 text-paper/50 border-t py-6 text-center text-xs">
        © {new Date().getFullYear()} {settings.name}. כל הזכויות שמורות.
      </div>
    </footer>
  )
}
