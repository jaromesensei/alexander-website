import { PartyPopper, Trophy, Cake, Briefcase } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { EventCard } from './EventCard'
import { waLink, WA_MESSAGES } from '@/lib/whatsapp'
import type { RestaurantSettings } from '@/types/db'

const EVENTS = [
  { icon: PartyPopper, title: 'אירועים פרטיים', description: 'החלל כולו, רק בשבילכם.' },
  { icon: Trophy, title: 'צפייה בספורט', description: 'מסכים גדולים, אווירה גדולה.' },
  { icon: Cake, title: 'ימי הולדת', description: 'עוגה, שירים, בלי כאב ראש.' },
  { icon: Briefcase, title: 'אירועי חברה', description: 'ערב צוות שיזכרו.' },
]

export function EventsSection({ settings }: { settings: RestaurantSettings }) {
  const href = waLink(settings.whatsapp, WA_MESSAGES.events) ?? `tel:${settings.phone}`

  return (
    <section id="events" className="scroll-mt-20 py-20 sm:py-32">
      <Container>
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="label-caps text-pink mb-3 text-xs">בואו לחגוג</p>
            <h2 className="font-display text-4xl leading-[0.95] sm:text-6xl">אירועים</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href={href} target="_blank" variant="outline">
              בואו נחגוג
            </ButtonLink>
          </Reveal>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {EVENTS.map((e, i) => (
            <EventCard key={e.title} {...e} delay={i * 0.06} />
          ))}
        </div>
      </Container>
    </section>
  )
}
