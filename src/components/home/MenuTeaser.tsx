import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

export function MenuTeaser() {
  return (
    <section className="bg-turquoise text-ink py-20 sm:py-28">
      <Container className="text-center">
        <Reveal>
          <p className="label-caps mb-4 text-xs">מבורגרים ועד קינוחים</p>
          <h2 className="font-display text-5xl leading-[0.9] sm:text-8xl">התפריט המלא</h2>
          <p className="mx-auto mt-6 max-w-md text-lg font-medium">
            כל הקטגוריות, כל המנות, בכל שפה שתבחרו.
          </p>
          <ButtonLink href="/menu" variant="secondary" size="lg" className="mt-9">
            למעבר לתפריט
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  )
}
