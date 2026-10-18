import { PartyPopper, Trophy, Cake, Briefcase } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { EventCard } from './EventCard'
import { waLink, WA_MESSAGES } from '@/lib/whatsapp'
import type { RestaurantSettings } from '@/types/db'

const EVENTS = [
  { icon: PartyPopper, title: 'אירועים פרטיים', description: 'כל המקום, רק בשבילכם.' },
  { icon: Trophy, title: 'צפייה בספורט', description: 'משחקים גדולים על מסך גדול.' },
  { icon: Cake, title: 'ימי הולדת', description: 'אנחנו דואגים לכל השאר.' },
  { icon: Briefcase, title: 'אירועי חברה', description: 'ערב צוות שיזכרו.' },
]

export function EventsSection({ settings }: { settings: RestaurantSettings }) {
  const href = waLink(settings.whatsapp, WA_MESSAGES.events) ?? `tel:${settings.phone}`

  return (
    <section id="events" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-4xl leading-tight sm:text-5xl">אירועים</h2>
          <ButtonLink href={href} target="_blank" variant="outline">
            בואו נחגוג
          </ButtonLink>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {EVENTS.map((e) => (
            <EventCard key={e.title} {...e} />
          ))}
        </div>
      </Container>
    </section>
  )
}
