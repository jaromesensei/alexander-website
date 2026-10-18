import type { BlockBg } from '@/lib/blocks/types'

export const BG_CLASSES: Record<BlockBg, string> = {
  paper: 'bg-paper text-ink',
  ink: 'bg-ink text-paper grain relative',
  pink: 'bg-pink text-ink',
  mustard: 'bg-mustard text-ink',
  turquoise: 'bg-turquoise text-ink',
}

export const MUTED_TEXT: Record<BlockBg, string> = {
  paper: 'text-ink-soft',
  ink: 'text-paper/70',
  pink: 'text-ink/80',
  mustard: 'text-ink/80',
  turquoise: 'text-ink/80',
}

/** הוורוד שמור לפעולה הראשית; על רקע צבעוני הכפתור הופך לשחור. */
export function primaryVariant(bg: BlockBg) {
  return bg === 'paper' || bg === 'ink' ? 'primary' : 'secondary'
}

export function outlineVariant(bg: BlockBg) {
  return bg === 'ink' ? 'outlineInverse' : 'outline'
}
