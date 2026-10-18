import { ButtonLink, type ButtonVariant, type ButtonSize } from '@/components/ui/Button'
import { resolveHref } from '@/lib/links'
import type { LinkValue } from '@/lib/blocks/types'
import type { RestaurantSettings } from '@/types/db'

export function BlockButton({
  link,
  settings,
  variant,
  size,
  className,
  onClick,
  children,
}: {
  link: LinkValue | null
  settings: RestaurantSettings
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}) {
  if (!link?.label) return null
  const resolved = resolveHref(link.href, settings)
  if (!resolved) return null

  return (
    <ButtonLink
      href={resolved.href}
      target={resolved.external ? '_blank' : undefined}
      rel={resolved.external ? 'noreferrer' : undefined}
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
    >
      {children}
      {link.label}
    </ButtonLink>
  )
}
