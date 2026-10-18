import { waLink, WA_KINDS, type WaKind } from './whatsapp'
import { siteText } from './siteTexts'
import type { NavItem, RestaurantSettings } from '@/types/db'

/**
 * טוקני פעולה שאפשר לשים בכל כפתור/קישור. נפתרים בזמן הרינדור לפי ההגדרות,
 * כך ששינוי מספר וואטסאפ בהגדרות מעדכן את כל הכפתורים באתר.
 */
export const LINK_ACTIONS = {
  'wa:reservation': 'וואטסאפ — הזמנת שולחן',
  'wa:events': 'וואטסאפ — אירועים',
  'wa:delivery': 'וואטסאפ — משלוח',
  tel: 'חיוג למסעדה',
  waze: 'ניווט בוויז',
} as const

/** קישור וואטסאפ עם ההודעה הערוכה; בלי מספר וואטסאפ — חיוג. */
export function waHref(settings: RestaurantSettings, kind: WaKind): string {
  return (
    waLink(settings.whatsapp, siteText(settings, `wa.${kind}`)) ?? `tel:${settings.phone}`
  )
}

export function wazeHref(settings: RestaurantSettings): string | null {
  return settings.lat && settings.lng
    ? `https://waze.com/ul?ll=${settings.lat},${settings.lng}&navigate=yes`
    : settings.map_url
}

/**
 * הופך href שמור לקישור אמיתי. מחזיר null לקישור לא בטוח (javascript: וכו')
 * או לפעולה שאין לה נתונים — והכפתור פשוט לא מוצג.
 */
export function resolveHref(
  href: string,
  settings: RestaurantSettings,
): { href: string; external: boolean } | null {
  const h = href.trim()
  if (!h) return null

  if (h.startsWith('wa:')) {
    const kind = h.slice(3) as WaKind
    if (!WA_KINDS.includes(kind)) return null
    return { href: waHref(settings, kind), external: true }
  }
  if (h === 'tel') return { href: `tel:${settings.phone}`, external: true }
  if (h === 'waze') {
    const w = wazeHref(settings)
    return w ? { href: w, external: true } : null
  }
  if ((h.startsWith('/') && !h.startsWith('//')) || h.startsWith('#')) {
    return { href: h, external: false }
  }
  if (/^(https?:\/\/|mailto:|tel:)/i.test(h)) return { href: h, external: true }
  return null
}

export const DEFAULT_NAV: NavItem[] = [
  { href: '/menu', label: 'תפריט' },
  { href: '/#diner', label: 'אודות' },
  { href: '/#events', label: 'אירועים' },
  { href: '/gallery', label: 'גלריה' },
  { href: '/contact', label: 'מיקום' },
]

export function getNav(settings: RestaurantSettings): NavItem[] {
  return settings.nav_items && settings.nav_items.length > 0
    ? settings.nav_items
    : DEFAULT_NAV
}
