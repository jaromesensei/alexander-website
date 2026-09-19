import { forwardRef } from 'react'
import Link, { type LinkProps } from 'next/link'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-ketchup text-cream hover:bg-ketchup-dark',
  secondary: 'bg-charcoal text-cream hover:bg-charcoal-soft',
  outline: 'border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-cream',
  ghost: 'text-charcoal hover:bg-cream-dark',
} as const

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
} as const

export function buttonClasses(
  variant: keyof typeof variants = 'primary',
  size: keyof typeof sizes = 'md',
  className?: string,
) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ketchup',
    variants[variant],
    sizes[size],
    className,
  )
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button ref={ref} className={buttonClasses(variant, size, className)} {...props} />
    )
  },
)
Button.displayName = 'Button'

type ButtonLinkProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: keyof typeof variants
    size?: keyof typeof sizes
  }

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <Link ref={ref} className={buttonClasses(variant, size, className)} {...props} />
    )
  },
)
ButtonLink.displayName = 'ButtonLink'
