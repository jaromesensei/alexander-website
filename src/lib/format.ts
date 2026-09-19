/** כסף מאוחסן תמיד כמספר שלם באגורות — לעולם לא float. */
export function formatCurrency(agorot: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: agorot % 100 === 0 ? 0 : 2,
  }).format(agorot / 100)
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
