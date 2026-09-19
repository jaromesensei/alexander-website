import { cn } from '@/lib/utils'

const tones = {
  mustard: 'bg-mustard/20 text-mustard-dark',
  ketchup: 'bg-ketchup/10 text-ketchup',
  forest: 'bg-forest/10 text-forest',
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
