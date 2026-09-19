import type { Metadata } from 'next'
import { Phone, MapPin, Clock, MessageCircle, Mail } from 'lucide-react'
import { getSettings } from '@/lib/data/settings'
import { HOURS_LABELS } from '@/lib/data/fallback'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { formatTime } from '@/lib/format'

export const metadata: Metadata = {
  title: 'מיקום ויצירת קשר',
  description: 'כתובת, שעות פתיחה וטלפון של אלכסנדר בנהריה.',
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <Section>
      <SectionHeading eyebrow="בואו לבקר" title="מיקום ויצירת קשר" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <MapPin className="text-ketchup mt-1 size-5 shrink-0" />
            <div>
              <p className="font-semibold">כתובת</p>
              <p className="text-charcoal-soft">{settings.address}</p>
              {settings.map_url && (
                <a
                  href={settings.map_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ketchup mt-1 inline-block text-sm font-semibold hover:underline"
                >
                  פתיחה בגוגל מפות
                </a>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="text-ketchup mt-1 size-5 shrink-0" />
            <div>
              <p className="font-semibold">טלפון</p>
              <a href={`tel:${settings.phone}`} className="text-charcoal-soft" dir="ltr">
                {settings.phone}
              </a>
            </div>
          </div>

          {settings.email && (
            <div className="flex items-start gap-3">
              <Mail className="text-ketchup mt-1 size-5 shrink-0" />
              <div>
                <p className="font-semibold">אימייל</p>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-charcoal-soft"
                  dir="ltr"
                >
                  {settings.email}
                </a>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Clock className="text-ketchup mt-1 size-5 shrink-0" />
            <div className="w-full">
              <p className="mb-2 font-semibold">שעות פתיחה</p>
              <ul className="text-charcoal-soft space-y-1 text-sm">
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
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {settings.whatsapp && (
              <ButtonLink
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                size="sm"
              >
                <MessageCircle className="size-4" />
                וואטסאפ
              </ButtonLink>
            )}
            <ButtonLink href="/reservations" variant="outline" size="sm">
              הזמנת שולחן
            </ButtonLink>
          </div>
        </Card>

        <div className="border-charcoal/10 overflow-hidden rounded-2xl border">
          {settings.lat && settings.lng ? (
            <iframe
              title="מפה"
              className="h-full min-h-80 w-full"
              loading="lazy"
              src={`https://www.google.com/maps?q=${settings.lat},${settings.lng}&output=embed`}
            />
          ) : (
            <div className="bg-cream-dark text-charcoal-soft flex h-full min-h-80 items-center justify-center">
              מפה תוצג לאחר עדכון קואורדינטות בניהול
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
