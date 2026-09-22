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
      {eyebrow && <p className="label-caps text-pink mb-3 text-sm">{eyebrow}</p>}
      <h2 className="text-4xl leading-[0.95] sm:text-6xl">{title}</h2>
      {description && <p className="text-ink-soft mt-4 text-lg">{description}</p>}
    </div>
  )
}
