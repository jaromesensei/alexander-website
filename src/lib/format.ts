/** כסף מאוחסן תמיד כמספר שלם באגורות — לעולם לא float. */
export function formatCurrency(agorot: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: agorot % 100 === 0 ? 0 : 2,
  }).format(agorot / 100)
}

/** טווח מחירים למנה עם כמה גדלים, למשל "36–59 ₪"; מחיר אחד — כרגיל. */
export function formatPriceRange(item: {
  price_agorot: number
  price_variants?: { price_agorot: number }[] | null
}): string {
  const prices = item.price_variants?.length
    ? item.price_variants.map((v) => v.price_agorot)
    : [item.price_agorot]
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return formatCurrency(min)
  const num = (a: number) =>
    new Intl.NumberFormat('he-IL', {
      maximumFractionDigits: a % 100 === 0 ? 0 : 2,
    }).format(a / 100)
  // בידוד LTR (U+2066…U+2069) — אחרת בעברית הטווח מתהפך ל-"32–18"
  return `\u2066${num(min)}–${num(max)}\u2069 ₪`
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function formatTime(time: string): string {
  // time מגיע כ-'HH:MM' או 'HH:MM:SS' מ-Postgres
  return time.slice(0, 5)
}
