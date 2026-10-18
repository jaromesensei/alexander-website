export function waLink(phone: string | null, message: string): string | null {
  if (!phone) return null
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/** סוגי הודעות הוואטסאפ; הנוסח עצמו ניתן לעריכה ב"טקסטים באתר" (wa.*). */
export const WA_KINDS = ['reservation', 'events', 'delivery'] as const
export type WaKind = (typeof WA_KINDS)[number]
