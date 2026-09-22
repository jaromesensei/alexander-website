import { forwardRef } from 'react'
import Link, { type LinkProps } from 'next/link'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-pink text-paper hover:bg-pink-dark',
  secondary: 'bg-ink text-paper hover:bg-ink-soft',
  outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-paper',
  outlineInverse: 'border-2 border-paper text-paper hover:bg-paper hover:text-ink',
  ghost: 'text-ink hover:bg-paper-dark',
} as const

const sizes = {
  sm: 'h-10 px-4 text-xs',
  md: 'h-13 px-7 text-sm',
  lg: 'h-16 px-9 text-base',
} as const

export function buttonClasses(
  variant: keyof typeof variants = 'primary',
  size: keyof typeof sizes = 'md',
  className?: string,
) {
  return cn(
    'label-caps inline-flex items-center justify-center gap-2 transition-all duration-200',
    'hover:-translate-y-0.5 active:translate-y-0',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink',
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
