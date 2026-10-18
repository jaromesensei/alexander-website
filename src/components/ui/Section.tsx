import { cn } from '@/lib/utils'
import { Container } from './Container'

export function Section({
  className,
  containerClassName,
  ...props
}: React.HTMLAttributes<HTMLElement> & { containerClassName?: string }) {
  return (
    <section className={cn('py-16 sm:py-24', className)}>
      <Container className={containerClassName}>{props.children}</Container>
    </section>
  )
}

export function SectionHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <h1 className="text-4xl leading-tight sm:text-5xl">{title}</h1>
      {description && (
        <p className="text-ink-soft mt-4 text-lg whitespace-pre-line">{description}</p>
      )}
    </div>
  )
}
