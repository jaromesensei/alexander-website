import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'border-ink/20 h-12 w-full rounded-xl border bg-white px-4 text-base',
      'placeholder:text-ink-soft/50 focus:border-pink focus:outline-none',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'border-ink/20 w-full rounded-xl border bg-white px-4 py-3 text-base',
      'placeholder:text-ink-soft/50 focus:border-pink focus:outline-none',
      className,
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export const Label = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('mb-1.5 block text-sm font-semibold', className)}
    {...props}
  />
))
Label.displayName = 'Label'
