import { Navigation } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { HOURS_LABELS } from '@/lib/data/fallback'
import { formatTime } from '@/lib/format'
import { waLink, WA_MESSAGES } from '@/lib/whatsapp'
import type { RestaurantSettings } from '@/types/db'

export function LocationSection({ settings }: { settings: RestaurantSettings }) {
  const wazeHref =
    settings.lat && settings.lng
      ? `https://waze.com/ul?ll=${settings.lat},${settings.lng}&navigate=yes`
      : settings.map_url

  return (
    <section className="border-ink border-t-2 py-20 sm:py-28">
      <Container className="grid gap-12 sm:grid-cols-2">
        <div>
          <h2 className="text-4xl leading-tight sm:text-5xl">{settings.address}</h2>
          <a
            href={`tel:${settings.phone}`}
            className="text-ink-soft hover:text-ink mt-3 inline-block text-lg tabular-nums"
            dir="ltr"
          >
            {settings.phone}
          </a>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              href={
                waLink(settings.whatsapp, WA_MESSAGES.reservation) ??
                `tel:${settings.phone}`
              }
              target="_blank"
            >
              הזמנת שולחן
            </ButtonLink>
            {wazeHref && (
              <ButtonLink href={wazeHref} target="_blank" variant="outline">
                <Navigation className="size-4" aria-hidden="true" />
                ניווט בוויז
              </ButtonLink>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xl">שעות פתיחה</h3>
          <ul className="divide-ink/10 divide-y text-lg">
            {HOURS_LABELS.map((label, i) => {
              const h = settings.hours[String(i)]
              return (
                <li key={i} className="flex justify-between py-2.5">
                  <span>{label}</span>
                  <span className="text-ink-soft tabular-nums" dir="ltr">
                    {h ? `${formatTime(h.open)}–${formatTime(h.close)}` : 'סגור'}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}
