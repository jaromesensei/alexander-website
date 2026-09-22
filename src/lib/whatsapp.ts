export function waLink(phone: string | null, message: string): string | null {
  if (!phone) return null
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export const WA_MESSAGES = {
  reservation: 'היי אלכסנדר! אשמח להזמין שולחן 🍔',
  delivery: 'היי אלכסנדר! אשמח לשמוע לגבי משלוח 🛵',
  events: 'היי אלכסנדר! אשמח לשמוע לגבי אירוע פרטי אצלכם 🎉',
} as const
