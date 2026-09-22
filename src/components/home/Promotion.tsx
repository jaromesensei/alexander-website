import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { waLink, WA_MESSAGES } from '@/lib/whatsapp'
import { ButtonLink } from '@/components/ui/Button'
import type { RestaurantSettings } from '@/types/db'

export function Promotion({ settings }: { settings: RestaurantSettings }) {
  if (!settings.promo_active || !settings.promo_title) return null

  return (
    <section className="bg-mustard text-ink py-14 sm:py-20">
      <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <p className="label-caps mb-3 text-xs">עכשיו אצלנו</p>
          <h2 className="font-display max-w-2xl text-4xl leading-[0.95] sm:text-6xl">
            {settings.promo_title}
          </h2>
          {settings.promo_description && (
            <p className="mt-4 max-w-lg text-lg font-medium">
              {settings.promo_description}
            </p>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <ButtonLink
            href={
              waLink(settings.whatsapp, WA_MESSAGES.reservation) ??
              `tel:${settings.phone}`
            }
            target="_blank"
            variant="secondary"
            size="lg"
          >
            אני בפנים
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  )
}
