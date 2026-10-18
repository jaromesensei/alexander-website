import type { Metadata } from 'next'
import { Navigation } from 'lucide-react'
import { getSettings } from '@/lib/data/settings'
import { HOURS_LABELS } from '@/lib/data/fallback'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'
import { formatTime } from '@/lib/format'
import { waLink, WA_MESSAGES } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'מיקום ויצירת קשר',
  description: 'כתובת, שעות פתיחה וטלפון של אלכסנדר בנהריה.',
}

export default async function ContactPage() {
  const settings = await getSettings()
  const hasCoords = Boolean(settings.lat && settings.lng)
  const wazeHref = hasCoords
    ? `https://waze.com/ul?ll=${settings.lat},${settings.lng}&navigate=yes`
    : settings.map_url

  return (
    <Section>
      <SectionHeading title="מיקום ויצירת קשר" />

      <div className={hasCoords ? 'grid gap-12 lg:grid-cols-2' : 'max-w-xl'}>
        <div className="space-y-8">
          <div>
            <p className="text-2xl font-bold">{settings.address}</p>
            {settings.map_url && (
              <a
                href={settings.map_url}
                target="_blank"
                rel="noreferrer"
                className="text-pink hover:text-pink-dark mt-1 inline-block font-semibold underline underline-offset-4"
              >
                פתיחה בגוגל מפות
              </a>
            )}
          </div>

          <dl className="space-y-1 text-lg">
            <div className="flex gap-3">
              <dt className="text-ink-soft w-16">טלפון</dt>
              <dd>
                <a href={`tel:${settings.phone}`} className="tabular-nums" dir="ltr">
                  {settings.phone}
                </a>
              </dd>
            </div>
            {settings.email && (
              <div className="flex gap-3">
                <dt className="text-ink-soft w-16">אימייל</dt>
                <dd>
                  <a href={`mailto:${settings.email}`} dir="ltr">
                    {settings.email}
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <div>
            <h2 className="mb-3 text-xl">שעות פתיחה</h2>
            <ul className="divide-ink/10 divide-y text-lg">
              {HOURS_LABELS.map((label, i) => {
                const h = settings.hours[String(i)]
                return (
                  <li key={i} className="flex justify-between py-2">
                    <span>{label}</span>
                    <span className="text-ink-soft tabular-nums" dir="ltr">
                      {h ? `${formatTime(h.open)}–${formatTime(h.close)}` : 'סגור'}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
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

        {hasCoords && (
          <iframe
            title={`מפה: ${settings.address}`}
            className="border-ink/10 h-full min-h-96 w-full border"
            loading="lazy"
            src={`https://www.google.com/maps?q=${settings.lat},${settings.lng}&output=embed`}
          />
        )}
      </div>
    </Section>
  )
}
