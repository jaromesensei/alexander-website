import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'border-ink/20 h-12 w-full rounded-xl border bg-white px-4 text-base',
      'focus:border-pink focus:outline-none',
      className,
    )}
    {...props}
  />
))
Select.displayName = 'Select'
