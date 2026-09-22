import { Navigation } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
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
    <section className="border-ink/10 border-t py-20 sm:py-32">
      <Container className="grid gap-12 sm:grid-cols-2">
        <Reveal>
          <p className="label-caps text-pink mb-3 text-xs">נהריה</p>
          <h2 className="font-display text-4xl leading-[0.95] sm:text-6xl">
            {settings.address}
          </h2>
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
                <Navigation className="size-4" />
                וייז
              </ButtonLink>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="label-caps mb-4 text-xs">שעות פתיחה</p>
          <ul className="divide-ink/10 divide-y text-lg">
            {HOURS_LABELS.map((label, i) => {
              const h = settings.hours[String(i)]
              return (
                <li key={i} className="flex justify-between py-2.5">
                  <span className="font-semibold">{label}</span>
                  <span className="text-ink-soft" dir="ltr">
                    {h ? `${formatTime(h.open)}–${formatTime(h.close)}` : 'סגור'}
                  </span>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
