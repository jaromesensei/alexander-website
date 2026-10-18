import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export function MenuTeaser() {
  return (
    <section className="bg-turquoise text-ink py-16 sm:py-20">
      <Container className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-4xl leading-tight sm:text-5xl">התפריט המלא</h2>
          <p className="mt-3 max-w-md text-lg font-medium">
            כל המנות, עם מחירים ותיאורים, בכל שפה שתבחרו.
          </p>
        </div>
        <ButtonLink href="/menu" variant="secondary" size="lg" className="shrink-0">
          לתפריט
        </ButtonLink>
      </Container>
    </section>
  )
}
