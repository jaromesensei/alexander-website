import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import type { RestaurantSettings } from '@/types/db'

export function CTABand({ settings }: { settings: RestaurantSettings }) {
  return (
    <section className="bg-mustard py-14">
      <Container className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-start">
        <div>
          <h2 className="font-display text-charcoal text-2xl sm:text-3xl">
            רעבים? נשמור לכם שולחן
          </h2>
          <p className="text-charcoal-soft mt-1">
            או תזמינו אונליין ונביא את אלכסנדר אליכם
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/reservations" variant="secondary">
            הזמנת שולחן
          </ButtonLink>
          <ButtonLink
            href="/order"
            variant="outline"
            className="border-charcoal text-charcoal"
          >
            הזמנה אונליין
          </ButtonLink>
          {settings.whatsapp && (
            <ButtonLink
              href={`https://wa.me/${settings.whatsapp}`}
              variant="outline"
              className="border-charcoal text-charcoal"
              target="_blank"
            >
              וואטסאפ
            </ButtonLink>
          )}
        </div>
      </Container>
    </section>
  )
}
