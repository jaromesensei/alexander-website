import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export function PageCTA({
  title,
  primary,
  secondary,
}: {
  title: string
  primary: { href: string; label: string; target?: string }
  secondary: { href: string; label: string }
}) {
  return (
    <section className="border-ink border-t-2 py-16 sm:py-20">
      <Container className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-3xl leading-tight sm:text-4xl">{title}</h2>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={primary.href} target={primary.target} size="lg">
            {primary.label}
          </ButtonLink>
          <ButtonLink href={secondary.href} variant="outline" size="lg">
            {secondary.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
