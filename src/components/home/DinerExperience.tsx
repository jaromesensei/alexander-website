import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import type { RestaurantSettings } from '@/types/db'

export function DinerExperience({ settings }: { settings: RestaurantSettings }) {
  if (!settings.about) return null

  return (
    <section
      id="diner"
      className="bg-ink text-paper grain relative scroll-mt-20 py-24 sm:py-36"
    >
      <Container className="max-w-3xl">
        <Reveal>
          <p className="label-caps text-turquoise mb-6 text-xs">לא עוד דיינר</p>
          <p className="font-display text-3xl leading-[1.15] sm:text-5xl">
            {settings.about}
          </p>
          <ButtonLink href="/contact" variant="outlineInverse" className="mt-10">
            בואו לבקר
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  )
}
