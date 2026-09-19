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
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'center' | 'start'
}) {
  return (
    <div className={cn('mb-10 max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && (
        <p className="text-ketchup mb-2 text-sm font-bold tracking-[0.2em] uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      {description && <p className="text-charcoal-soft mt-4 text-lg">{description}</p>}
    </div>
  )
}
