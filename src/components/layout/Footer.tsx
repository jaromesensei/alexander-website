import Link from 'next/link'
import { Phone, MapPin } from 'lucide-react'
import { InstagramIcon, FacebookIcon } from '@/components/icons/SocialIcons'
import { HOURS_LABELS } from '@/lib/data/fallback'
import { Container } from '@/components/ui/Container'
import { formatTime } from '@/lib/format'
import { resolveHref } from '@/lib/links'
import { NewTabHint } from '@/components/a11y/NewTabHint'
import type { NavItem, RestaurantSettings } from '@/types/db'

export function Footer({
  settings,
  nav,
}: {
  settings: RestaurantSettings
  nav: NavItem[]
}) {
  const links = nav.flatMap((item) => {
    const r = resolveHref(item.href, settings)
    return r ? [{ ...r, label: item.label }] : []
  })

  return (
    <footer className="border-ink/10 bg-ink text-paper relative overflow-hidden border-t">
      <Container className="pt-16 pb-10">
        <p className="font-wordmark text-6xl sm:text-9xl" lang="en" aria-hidden="true">
          Alexander
        </p>
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
                className="bg-paper/10 hover:bg-pink-dark flex size-9 items-center justify-center rounded-full transition-colors"
                aria-label="אינסטגרם (נפתח בכרטיסייה חדשה)"
              >
                <InstagramIcon className="size-4" />
              </a>
            )}
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="bg-paper/10 hover:bg-pink-dark flex size-9 items-center justify-center rounded-full transition-colors"
                aria-label="פייסבוק (נפתח בכרטיסייה חדשה)"
              >
                <FacebookIcon className="size-4" />
              </a>
            )}
          </div>
        </div>

        <nav aria-labelledby="footer-nav-title">
          <h2 id="footer-nav-title" className="text-paper/50 mb-3 text-sm font-semibold">
            ניווט
          </h2>
          <ul className="text-paper/80 space-y-2 text-sm">
            {links.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  className="hover:text-paper"
                >
                  {item.label}
                  {item.external && <NewTabHint />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-paper/50 mb-3 text-sm font-semibold">יצירת קשר</h2>
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
          <h2 className="text-paper/50 mb-3 text-sm font-semibold">שעות פתיחה</h2>
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

      <div className="border-paper/10 text-paper/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t px-4 py-6 text-center text-sm">
        <span>
          © {new Date().getFullYear()} {settings.name}. כל הזכויות שמורות.
        </span>
        <Link
          href="/accessibility"
          className="hover:text-paper underline underline-offset-4"
        >
          הצהרת נגישות
        </Link>
      </div>
    </footer>
  )
}
