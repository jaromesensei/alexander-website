import { ButtonLink } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import type { RestaurantSettings } from '@/types/db'

export function StoryTeaser({ settings }: { settings: RestaurantSettings }) {
  if (!settings.about) return null

  return (
    <Section className="bg-cream-dark/40">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-ketchup mb-2 text-sm font-bold tracking-[0.2em] uppercase">
          הסיפור שלנו
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">מטבח שמרגיש כמו בית</h2>
        <p className="text-charcoal-soft mt-6 text-lg leading-relaxed">
          {settings.about}
        </p>
        <ButtonLink href="/contact" variant="outline" className="mt-8">
          בואו לבקר אותנו
        </ButtonLink>
      </div>
    </Section>
  )
}
