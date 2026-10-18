import type { Popup } from '@/types/db'
import type { ZonedNow } from './schedule'

/**
 * זוכר מה המבקר כבר ראה, לפי תדירות החלון. המפתח כולל את updated_at,
 * כך שעריכת חלון בניהול מציגה אותו מחדש גם למי שכבר ראה את הגרסה הקודמת.
 */
function key(p: Pick<Popup, 'id' | 'updated_at'>) {
  return `alex_popup_${p.id}_${p.updated_at}`
}

function store(frequency: Popup['frequency']): Storage | null {
  try {
    return frequency === 'session' ? window.sessionStorage : window.localStorage
  } catch {
    return null
  }
}

export function alreadySeen(p: Popup, now: ZonedNow): boolean {
  const value = store(p.frequency)?.getItem(key(p))
  if (!value) return false
  return p.frequency === 'day' ? value === now.date : true
}

export function markSeen(p: Popup, now: ZonedNow) {
  try {
    store(p.frequency)?.setItem(key(p), now.date)
  } catch {
    // מצב פרטי / אחסון חסום — החלון פשוט עלול להופיע שוב
  }
}
