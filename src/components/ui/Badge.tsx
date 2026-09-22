import { cn } from '@/lib/utils'

const tones = {
  mustard: 'bg-mustard/20 text-mustard-dark',
  pink: 'bg-pink/10 text-pink',
  turquoise: 'bg-turquoise/10 text-turquoise',
} as const

export function Badge({
  tone = 'mustard',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
