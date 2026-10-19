import type { RestaurantSettings } from '@/types/db'

/**
 * כל הטקסטים הקבועים באתר הציבורי (מחוץ לבלוקים של העורך), עם ברירת מחדל.
 * הבעלים יכול לשנות כל אחד מהם במסך "טקסטים באתר"; מה שלא שונה — ברירת המחדל.
 * נשמר ב-restaurant_settings.site_texts כ-{ key: text } (רק מה ששונה).
 */
export const SITE_TEXT_GROUPS = [
  {
    title: 'כללי — כפתורים וסרגלים',
    href: '/',
    items: [
      { key: 'header.reserve', label: 'כפתור ההזמנה בראש האתר', default: 'הזמנת שולחן' },
      { key: 'mobile.menu', label: 'סרגל תחתון בטלפון — תפריט', default: 'תפריט' },
      { key: 'mobile.reserve', label: 'סרגל תחתון בטלפון — הזמנה', default: 'הזמנה' },
      { key: 'mobile.call', label: 'סרגל תחתון בטלפון — חיוג', default: 'התקשרות' },
      { key: 'mobile.waze', label: 'סרגל תחתון בטלפון — ניווט', default: 'וייז' },
      { key: 'mobile.a11y', label: 'סרגל תחתון בטלפון — נגישות', default: 'נגישות' },
    ],
  },
  {
    title: 'הודעות וואטסאפ (ההודעה שנפתחת ללקוח)',
    href: null,
    items: [
      {
        key: 'wa.reservation',
        label: 'הזמנת שולחן',
        default: 'היי אלכסנדר! אשמח להזמין שולחן 🍔',
        multiline: true,
      },
      {
        key: 'wa.events',
        label: 'אירועים',
        default: 'היי אלכסנדר! אשמח לשמוע לגבי אירוע פרטי אצלכם 🎉',
        multiline: true,
      },
      {
        key: 'wa.delivery',
        label: 'משלוחים',
        default: 'היי אלכסנדר! אשמח לשמוע לגבי משלוח 🛵',
        multiline: true,
      },
    ],
  },
  {
    title: 'עמוד התפריט',
    href: '/menu',
    items: [
      { key: 'menu.title', label: 'כותרת', default: 'תפריט' },
      { key: 'menu.intro', label: 'טקסט פתיחה (לא חובה)', default: '', multiline: true },
      {
        key: 'menu.langLabel',
        label: 'טקסט ליד בורר השפה',
        default: 'התפריט בשפה שלכם:',
      },
      { key: 'menu.empty', label: 'כשאין עדיין מנות', default: 'התפריט יתעדכן בקרוב.' },
      {
        key: 'menu.ctaTitle',
        label: 'כותרת בתחתית העמוד',
        default: 'החלטתם? נשמור לכם שולחן',
      },
      { key: 'menu.ctaPrimary', label: 'כפתור ראשי בתחתית', default: 'הזמנת שולחן' },
      { key: 'menu.ctaSecondary', label: 'כפתור משני בתחתית', default: 'לגלריה' },
    ],
  },
  {
    title: 'עמוד הגלריה',
    href: '/gallery',
    items: [
      { key: 'gallery.title', label: 'כותרת', default: 'גלריה' },
      {
        key: 'gallery.intro',
        label: 'טקסט פתיחה (לא חובה)',
        default: '',
        multiline: true,
      },
      {
        key: 'gallery.empty',
        label: 'כשאין עדיין תמונות',
        default: 'תמונות מהמסעדה יעלו כאן בקרוב.',
      },
      {
        key: 'gallery.ctaTitle',
        label: 'כותרת בתחתית העמוד',
        default: 'ראיתם מספיק? בואו לטעום',
      },
      { key: 'gallery.ctaPrimary', label: 'כפתור ראשי בתחתית', default: 'לתפריט' },
      {
        key: 'gallery.ctaSecondary',
        label: 'כפתור משני בתחתית',
        default: 'מיקום ושעות פתיחה',
      },
    ],
  },
  {
    title: 'עמוד מיקום ויצירת קשר',
    href: '/contact',
    items: [
      { key: 'contact.title', label: 'כותרת', default: 'מיקום ויצירת קשר' },
      {
        key: 'contact.intro',
        label: 'טקסט פתיחה (לא חובה)',
        default: '',
        multiline: true,
      },
      { key: 'contact.mapLink', label: 'קישור למפה', default: 'פתיחה בגוגל מפות' },
      { key: 'contact.hoursTitle', label: 'כותרת שעות פתיחה', default: 'שעות פתיחה' },
      { key: 'contact.reserve', label: 'כפתור הזמנה', default: 'הזמנת שולחן' },
      { key: 'contact.waze', label: 'כפתור ניווט', default: 'ניווט בוויז' },
    ],
  },
  {
    title: 'סקשנים בעמוד הבית',
    href: '/',
    items: [
      {
        key: 'dishes.menuLink',
        label: 'מנות מומלצות — קישור לתפריט',
        default: 'לתפריט המלא',
      },
      {
        key: 'location.hoursTitle',
        label: 'מיקום — כותרת שעות פתיחה',
        default: 'שעות פתיחה',
      },
      { key: 'location.reserve', label: 'מיקום — כפתור הזמנה', default: 'הזמנת שולחן' },
      { key: 'location.waze', label: 'מיקום — כפתור ניווט', default: 'ניווט בוויז' },
    ],
  },
  {
    title: 'פוטר (תחתית כל עמוד)',
    href: '/',
    items: [
      { key: 'footer.nav', label: 'כותרת עמודת הניווט', default: 'ניווט' },
      { key: 'footer.contact', label: 'כותרת יצירת קשר', default: 'יצירת קשר' },
      { key: 'footer.hours', label: 'כותרת שעות פתיחה', default: 'שעות פתיחה' },
    ],
  },
  {
    title: 'עמוד "לא נמצא" (404)',
    href: '/404-preview',
    items: [
      { key: 'notFound.title', label: 'כותרת', default: 'הדף הזה לא בתפריט' },
      {
        key: 'notFound.text',
        label: 'טקסט',
        default: 'ייתכן שהקישור שגוי או שהדף הוסר. אפשר להמשיך מעמוד הבית או מהתפריט.',
        multiline: true,
      },
      { key: 'notFound.home', label: 'כפתור לעמוד הבית', default: 'לעמוד הבית' },
      { key: 'notFound.menu', label: 'כפתור לתפריט', default: 'לתפריט' },
    ],
  },
] as const satisfies readonly {
  title: string
  href: string | null
  items: readonly { key: string; label: string; default: string; multiline?: boolean }[]
}[]

export type SiteTextKey = (typeof SITE_TEXT_GROUPS)[number]['items'][number]['key']

const DEFAULTS = Object.fromEntries(
  SITE_TEXT_GROUPS.flatMap((g) => g.items.map((i) => [i.key, i.default])),
) as Record<SiteTextKey, string>

export function defaultText(key: SiteTextKey): string {
  return DEFAULTS[key]
}

/** הטקסט בפועל: מה שהבעלים כתב, ואם לא — ברירת המחדל. */
export function siteText(
  settings: Pick<RestaurantSettings, 'site_texts'>,
  key: SiteTextKey,
): string {
  const custom = settings.site_texts?.[key]
  return typeof custom === 'string' && custom.trim() ? custom : DEFAULTS[key]
}
