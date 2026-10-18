import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export function CocktailSection() {
  return (
    <section className="bg-pink text-ink py-24 sm:py-32">
      <Container>
        <h2 className="max-w-2xl text-4xl leading-tight sm:text-5xl">
          שותים אחת.
          <br />
          נשארים לעוד.
        </h2>
        <p className="mt-6 max-w-md text-lg font-medium">
          אלכסנדר לא נגמר עם הארוחה. קוקטיילים, שתייה קרה ומוזיקה טובה.
        </p>
        <ButtonLink href="/menu" variant="secondary" size="lg" className="mt-8">
          לתפריט השתייה
        </ButtonLink>
      </Container>
    </section>
  )
}
