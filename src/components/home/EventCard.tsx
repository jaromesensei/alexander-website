import type { LucideIcon } from 'lucide-react'

export function EventCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="border-ink border-t-2 pt-5">
      <Icon className="mb-4 size-6" strokeWidth={1.75} aria-hidden="true" />
      <h3 className="text-xl">{title}</h3>
      <p className="text-ink-soft mt-1">{description}</p>
    </div>
  )
}
