import type { Metadata } from 'next'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { ReservationForm } from '@/components/reservations/ReservationForm'
import { getSettings } from '@/lib/data/settings'

export const metadata: Metadata = {
  title: 'הזמנת שולחן',
  description: 'הזמינו שולחן אצלנו באלכסנדר, נהריה. נחזור אליכם לאישור בהקדם.',
}

export default async function ReservationsPage() {
  const settings = await getSettings()

  return (
    <Section containerClassName="max-w-2xl">
      <SectionHeading
        eyebrow="נשמח לארח אתכם"
        title="הזמנת שולחן"
        description={`הבקשה נשלחת ישירות אלינו. אפשר גם להתקשר ל-${settings.phone}${settings.whatsapp ? ' או לכתוב בוואטסאפ' : ''}.`}
      />
      <Card className="p-6 sm:p-8">
        <ReservationForm />
      </Card>
    </Section>
  )
}
