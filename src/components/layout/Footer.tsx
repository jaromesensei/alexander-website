import Link from 'next/link'
import { Phone, MapPin, Clock } from 'lucide-react'
import { InstagramIcon, FacebookIcon } from '@/components/icons/SocialIcons'
import { getSettings } from '@/lib/data/settings'
import { HOURS_LABELS } from '@/lib/data/fallback'
import { Container } from '@/components/ui/Container'
import { formatTime } from '@/lib/format'
import { navItems } from './navItems'

export async function Footer() {
  const settings = await getSettings()

  return (
    <footer className="border-charcoal/10 bg-charcoal text-cream mt-24 border-t">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-mustard text-2xl">{settings.name}</p>
          {settings.tagline && (
            <p className="text-cream/70 mt-2 text-sm">{settings.tagline}</p>
          )}
          <div className="mt-4 flex gap-3">
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="bg-cream/10 hover:bg-cream/20 flex size-9 items-center justify-center rounded-full"
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
                className="bg-cream/10 hover:bg-cream/20 flex size-9 items-center justify-center rounded-full"
                aria-label="פייסבוק"
              >
                <FacebookIcon className="size-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="text-mustard mb-3 font-semibold">ניווט</p>
          <ul className="text-cream/80 space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-mustard mb-3 font-semibold">יצירת קשר</p>
          <ul className="text-cream/80 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-cream" dir="ltr">
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
          <p className="text-mustard mb-3 flex items-center gap-2 font-semibold">
            <Clock className="size-4" />
            שעות פתיחה
          </p>
          <ul className="text-cream/80 space-y-1 text-sm">
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

      <div className="border-cream/10 text-cream/50 border-t py-6 text-center text-xs">
        © {new Date().getFullYear()} {settings.name}. כל הזכויות שמורות.
      </div>
    </footer>
  )
}
