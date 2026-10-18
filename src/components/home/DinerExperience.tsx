import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import type { RestaurantSettings } from '@/types/db'

export function DinerExperience({ settings }: { settings: RestaurantSettings }) {
  if (!settings.about) return null

  return (
    <section
      id="diner"
      className="bg-ink text-paper grain relative scroll-mt-20 py-24 sm:py-32"
    >
      <Container>
        <h2 className="sr-only">אודות</h2>
        <p className="max-w-3xl text-3xl leading-snug font-bold sm:text-4xl">
          {settings.about}
        </p>
        <ButtonLink href="/contact" variant="outlineInverse" className="mt-10">
          מיקום ושעות פתיחה
        </ButtonLink>
      </Container>
    </section>
  )
}
