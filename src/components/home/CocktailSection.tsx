import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

export function CocktailSection() {
  return (
    <section className="bg-ink text-paper grain relative overflow-hidden py-24 sm:py-36">
      <div className="from-pink/20 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent" />
      <Container className="relative">
        <Reveal>
          <p className="label-caps text-pink mb-6 text-xs">אחרי השמש יורדת</p>
          <h2 className="font-display max-w-2xl text-4xl leading-[0.95] sm:text-7xl">
            שותים אחת.
            <br />
            נשארים לעוד.
          </h2>
          <p className="text-paper/70 mt-6 max-w-md text-lg">
            אלכסנדר לא נגמר עם הארוחה. קוקטיילים, שתייה קרה ואווירה שממשיכה עד שנרגיש
            כמונו.
          </p>
          <ButtonLink href="/menu" variant="outlineInverse" className="mt-8">
            לתפריט השתייה
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  )
}
