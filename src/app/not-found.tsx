import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export default function NotFound() {
  return (
    <section className="bg-ink text-paper flex min-h-[80svh] items-center">
      <Container>
        <p className="font-wordmark text-paper/30 text-8xl leading-none">404</p>
        <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">הדף הזה לא בתפריט</h1>
        <p className="text-paper/70 mt-4 max-w-sm text-lg">
          ייתכן שהקישור שגוי או שהדף הוסר. אפשר להמשיך מעמוד הבית או מהתפריט.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
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
