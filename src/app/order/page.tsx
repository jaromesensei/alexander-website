import type { Metadata } from 'next'
import { MessageCircle, Phone, ExternalLink } from 'lucide-react'
import { getSettings } from '@/lib/data/settings'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'הזמנה אונליין',
  description: 'הזמינו משלוח או איסוף עצמי מאלכסנדר — וולט, 10ביס, וואטסאפ או טלפון.',
}

export default async function OrderPage() {
  const settings = await getSettings()

  const platforms = [
    settings.wolt_url && { label: 'הזמנה ב-Wolt', href: settings.wolt_url },
    settings.tenbis_url && { label: 'הזמנה ב-10ביס', href: settings.tenbis_url },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <Section containerClassName="max-w-2xl">
      <SectionHeading
        eyebrow="משלוחים ואיסוף"
        title="הזמנה אונליין"
        description="בוחרים את הדרך הנוחה לכם — משלוח דרך אחת מהפלטפורמות, או הזמנה ישירה בטלפון/וואטסאפ."
      />

      <div className="space-y-4">
        {platforms.map((p) => (
          <Card key={p.href} className="flex items-center justify-between p-5">
            <p className="font-display text-lg">{p.label}</p>
            <ButtonLink href={p.href} target="_blank" size="sm">
              <ExternalLink className="size-4" />
              מעבר להזמנה
            </ButtonLink>
          </Card>
        ))}

        <Card className="flex items-center justify-between p-5">
          <p className="font-display text-lg">הזמנה טלפונית</p>
          <ButtonLink href={`tel:${settings.phone}`} variant="outline" size="sm">
            <Phone className="size-4" />
            {settings.phone}
          </ButtonLink>
        </Card>

        {settings.whatsapp && (
          <Card className="flex items-center justify-between p-5">
            <p className="font-display text-lg">הזמנה בוואטסאפ</p>
            <ButtonLink
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              variant="outline"
              size="sm"
            >
              <MessageCircle className="size-4" />
              פתיחת צ׳אט
            </ButtonLink>
          </Card>
        )}

        {platforms.length === 0 && (
          <p className="text-charcoal-soft pt-2 text-center text-sm">
            קישורי המשלוחים יתעדכנו בקרוב — בינתיים אפשר להזמין בטלפון או בוואטסאפ.
          </p>
        )}
      </div>
    </Section>
  )
}
