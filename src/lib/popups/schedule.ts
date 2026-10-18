import type { Popup } from '@/types/db'

/** כל התזמונים לפי שעון ישראל — גם אם המבקר בחו"ל, המבצע הוא לפי השעה במסעדה. */
export const TIME_ZONE = 'Asia/Jerusalem'

export interface ZonedNow {
  /** 0 = ראשון … 6 = שבת */
  weekday: number
  /** דקות מתחילת היום */
  minutes: number
  /** 'YYYY-MM-DD' */
  date: string
}

const WEEKDAYS: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

export function zonedNow(at: Date = new Date()): ZonedNow {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
      hourCycle: 'h23',
    })
      .formatToParts(at)
      .map((p) => [p.type, p.value]),
  )
  return {
    weekday: WEEKDAYS[parts.weekday] ?? 0,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    date: `${parts.year}-${parts.month}-${parts.day}`,
  }
}

function toMinutes(time: string | null): number | null {
  if (!time) return null
  const [h, m] = time.split(':').map(Number)
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null
}

type Schedule = Pick<
  Popup,
  'is_active' | 'days' | 'start_time' | 'end_time' | 'start_date' | 'end_date'
>

/**
 * האם החלון אמור להופיע עכשיו. שעות שחוצות חצות (22:00–02:00) נחשבות
 * ליום שבו הן מתחילות: 01:00 בשבת שייך לחלון של שישי.
 */
export function isPopupLive(p: Schedule, now: ZonedNow): boolean {
  if (!p.is_active) return false
  if (p.start_date && now.date < p.start_date) return false
  if (p.end_date && now.date > p.end_date) return false

  const start = toMinutes(p.start_time) ?? 0
  const end = toMinutes(p.end_time) ?? 24 * 60
  if (start === end || (start === 0 && end === 24 * 60))
    return p.days.includes(now.weekday)
  if (start < end) {
    return p.days.includes(now.weekday) && now.minutes >= start && now.minutes < end
  }
  if (now.minutes >= start) return p.days.includes(now.weekday)
  if (now.minutes < end) return p.days.includes((now.weekday + 6) % 7)
  return false
}

export type PopupStatus = 'live' | 'scheduled' | 'ended' | 'off'

export function popupStatus(p: Schedule, now: ZonedNow): PopupStatus {
  if (!p.is_active) return 'off'
  if (p.end_date && now.date > p.end_date) return 'ended'
  return isPopupLive(p, now) ? 'live' : 'scheduled'
}

export const DAY_SHORT = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']
export const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

function formatDate(date: string) {
  const [, m, d] = date.split('-')
  return `${Number(d)}.${Number(m)}`
}

/** תיאור קריא של התזמון, למשל "א׳–ה׳ · 17:00–19:00 · עד 31.12". */
export function describeSchedule(p: Schedule): string {
  const days = [...p.days].sort((a, b) => a - b)
  let dayText: string
  if (days.length === 7) dayText = 'כל יום'
  else if (days.length === 0) dayText = 'אף יום'
  else if (days.length >= 3 && days[days.length - 1] - days[0] === days.length - 1) {
    dayText = `${DAY_SHORT[days[0]]}–${DAY_SHORT[days[days.length - 1]]}`
  } else dayText = days.map((d) => DAY_SHORT[d]).join(', ')

  const hours =
    p.start_time && p.end_time
      ? `${p.start_time.slice(0, 5)}–${p.end_time.slice(0, 5)}`
      : 'כל היום'

  const dates =
    p.start_date && p.end_date
      ? `${formatDate(p.start_date)}–${formatDate(p.end_date)}`
      : p.start_date
        ? `מ-${formatDate(p.start_date)}`
        : p.end_date
          ? `עד ${formatDate(p.end_date)}`
          : null

  return [dayText, hours, dates].filter(Boolean).join(' · ')
}

export function placementMatches(placement: Popup['placement'], pathname: string) {
  if (placement === 'home') return pathname === '/'
  if (placement === 'menu') return pathname === '/menu'
  return true
}
