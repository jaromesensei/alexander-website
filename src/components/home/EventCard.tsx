import type { LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

export function EventCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
}) {
  return (
    <Reveal delay={delay} className="border-ink/10 border-t pt-6">
      <Icon className="text-pink mb-4 size-7" strokeWidth={1.5} />
      <h3 className="font-display text-xl">{title}</h3>
      <p className="text-ink-soft mt-2 text-sm leading-relaxed">{description}</p>
    </Reveal>
  )
}
