import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

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
    <section className="border-ink/10 border-t py-20 sm:py-28">
      <Container className="text-center">
        <Reveal>
          <h2 className="font-display text-3xl leading-[0.95] sm:text-5xl">{title}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink href={primary.href} target={primary.target} size="lg">
              {primary.label}
            </ButtonLink>
            <ButtonLink href={secondary.href} variant="outline" size="lg">
              {secondary.label}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
