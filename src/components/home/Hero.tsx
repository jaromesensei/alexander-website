import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import type { RestaurantSettings } from '@/types/db'

export function Hero({ settings }: { settings: RestaurantSettings }) {
  return (
    <section className="bg-charcoal text-cream relative overflow-hidden">
      <div className="diner-checker absolute inset-x-0 bottom-0 h-3 opacity-80" />
      <Container className="grid gap-10 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-mustard mb-4 text-sm font-bold tracking-[0.3em] uppercase">
            נהריה · דיינר משפחתי
          </p>
          <h1 className="font-display text-5xl leading-tight sm:text-6xl">
            {settings.name}
          </h1>
          {settings.tagline && (
            <p className="text-cream/80 mt-4 text-xl sm:text-2xl">{settings.tagline}</p>
          )}
          <p className="text-cream/70 mt-6 max-w-md">
            המבורגרים טריים, רוטבים מהבית ואווירה שגורמת לכם להרגיש חלק מהמשפחה — מהביס
            הראשון ועד האחרון.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/menu" size="lg">
              לתפריט המלא
            </ButtonLink>
            <ButtonLink
              href="/contact"
              variant="outline"
              size="lg"
              className="border-cream text-cream hover:bg-cream hover:text-charcoal"
            >
              יצירת קשר
            </ButtonLink>
          </div>
        </div>

        <div className="from-ketchup/40 to-mustard/30 relative aspect-4/3 overflow-hidden rounded-3xl bg-gradient-to-br">
          {settings.hero_image_url ? (
            <Image
              src={settings.hero_image_url}
              alt={settings.name}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          ) : (
            <div className="text-cream/60 absolute inset-0 flex items-center justify-center text-center">
              <p className="font-display px-8 text-2xl">
                תמונת הירו של המנה הדגל
                <br />
                <span className="font-body text-sm">(מועלית מהניהול)</span>
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
