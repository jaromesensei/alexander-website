import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export default function NotFound() {
  return (
    <section className="bg-ink text-paper flex min-h-[80svh] items-center">
      <Container className="text-center">
        <p className="label-caps text-turquoise mb-6 text-xs">404</p>
        <h1 className="font-display text-6xl leading-[0.9] sm:text-8xl">
          הדף הזה
          <br />
          לא בתפריט
        </h1>
        <p className="text-paper/70 mx-auto mt-6 max-w-sm text-lg">
          נראה שהלכתם לאיבוד. בואו נחזיר אתכם למקום עם האוכל.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/" size="lg">
            לעמוד הבית
          </ButtonLink>
          <ButtonLink href="/menu" variant="outlineInverse" size="lg">
            לתפריט
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
