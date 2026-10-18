import { forwardRef } from 'react'
import Link, { type LinkProps } from 'next/link'
import { cn } from '@/lib/utils'
import { NewTabHint } from '@/components/a11y/NewTabHint'

const variants = {
  primary: 'bg-pink-dark text-paper hover:bg-pink-deep',
  secondary: 'bg-ink text-paper hover:bg-ink-soft',
  outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-paper',
  outlineInverse: 'border-2 border-paper text-paper hover:bg-paper hover:text-ink',
  ghost: 'text-ink hover:bg-paper-dark',
} as const

const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
} as const

export type ButtonVariant = keyof typeof variants
export type ButtonSize = keyof typeof sizes

export function buttonClasses(
  variant: keyof typeof variants = 'primary',
  size: keyof typeof sizes = 'md',
  className?: string,
) {
  return cn(
    'inline-flex items-center justify-center gap-2 font-bold transition-colors duration-150',
    'active:scale-[0.98] motion-reduce:active:scale-100',
    'disabled:pointer-events-none disabled:opacity-50',
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
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const newTab = props.target === '_blank'
    return (
      <Link
        ref={ref}
        className={buttonClasses(variant, size, className)}
        rel={newTab ? 'noreferrer' : undefined}
        {...props}
      >
        {children}
        {newTab && <NewTabHint />}
      </Link>
    )
  },
)
ButtonLink.displayName = 'ButtonLink'
