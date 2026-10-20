import type { Block } from './types'
import type { RestaurantSettings } from '@/types/db'

/**
 * עמוד הבית כברירת מחדל — זהה לעיצוב לפני שהיה עורך. משמש כשאין עדיין שורת
 * 'home' בטבלת pages, וכנקודת ההתחלה בעורך. מזהים קבועים כדי שהשרת והקליינט
 * ייצרו בדיוק אותו מבנה.
 */
export function defaultHomeBlocks(settings: RestaurantSettings): Block[] {
  return [
    {
      id: 'home-hero',
      type: 'hero',
      tagline: settings.tagline ?? '',
      subtitle: 'לוקאל דיינר בנהריה',
      image: settings.hero_image_url,
      primary: { label: 'הזמנת שולחן', href: 'wa:reservation' },
      secondary: { label: 'לתפריט', href: '/menu' },
    },
    {
      id: 'home-promo',
      type: 'cta',
      hidden: !settings.promo_active,
      title: settings.promo_title ?? 'מבצע',
      text: settings.promo_description ?? '',
      size: 'md',
      bg: 'mustard',
      button: { label: 'הזמנת שולחן', href: 'wa:reservation' },
    },
    { id: 'home-dishes', type: 'featured_dishes', title: 'המנות שבשבילן באים', limit: 4 },
    // דוגמה לקרוסלה חופשית: תמונה שמתפרקת לשכבות (public/demo-burger)
    {
      id: 'home-carousel',
      type: 'carousel',
      title: 'מה יש בפנים',
      bg: 'paper',
      slides: [
        {
          title: 'אלכסנדר בורגר',
          text: 'בשר בקר טרי שנטחן כל יום, בלחמניית בריוש.',
          badge: '',
          image: null,
          layers: [
            { image_url: '/demo-burger/bun-top.webp', label: 'לחמניית בריוש' },
            { image_url: '/demo-burger/lettuce.webp', label: 'חסה' },
            { image_url: '/demo-burger/tomato.webp', label: 'עגבנייה' },
            {
              image_url: '/demo-burger/onion-pickle.webp',
              label: 'בצל סגול ומלפפון חמוץ',
            },
            { image_url: '/demo-burger/patty.webp', label: 'קציצת בקר' },
            { image_url: '/demo-burger/bun-bottom.webp', label: 'לחמנייה' },
          ],
          button: { label: 'לתפריט', href: '/menu' },
        },
        {
          title: 'כל שכבה במקום',
          text: 'תמונה רגילה עובדת כמו בכל קרוסלה.',
          badge: '',
          image: '/demo-burger/full.webp',
          imageAlt: 'המבורגר שהמרכיבים שלו מרחפים זה מעל זה',
          layers: [],
          button: null,
        },
      ],
    },
    {
      id: 'home-menu',
      type: 'cta',
      title: 'התפריט המלא',
      text: 'כל המנות, עם מחירים ותיאורים, בכל שפה שתבחרו.',
      size: 'md',
      bg: 'turquoise',
      button: { label: 'לתפריט', href: '/menu' },
    },
    {
      id: 'home-diner',
      type: 'text',
      anchor: 'diner',
      title: '',
      text: settings.about ?? '',
      size: 'lg',
      bg: 'ink',
      button: { label: 'מיקום ושעות פתיחה', href: '/contact' },
    },
    {
      id: 'home-drinks',
      type: 'cta',
      title: 'שותים אחת.\nנשארים לעוד.',
      text: 'אלכסנדר לא נגמר עם הארוחה. קוקטיילים, שתייה קרה ומוזיקה טובה.',
      size: 'lg',
      bg: 'pink',
      button: { label: 'לתפריט השתייה', href: '/menu' },
    },
    {
      id: 'home-events',
      type: 'features',
      anchor: 'events',
      title: 'אירועים',
      bg: 'paper',
      button: { label: 'בואו נחגוג', href: 'wa:events' },
      items: [
        { icon: 'party', title: 'אירועים פרטיים', text: 'כל המקום, רק בשבילכם.' },
        { icon: 'trophy', title: 'צפייה בספורט', text: 'משחקים גדולים על מסך גדול.' },
        { icon: 'cake', title: 'ימי הולדת', text: 'אנחנו דואגים לכל השאר.' },
        { icon: 'briefcase', title: 'אירועי חברה', text: 'ערב צוות שיזכרו.' },
      ],
    },
    {
      id: 'home-gallery',
      type: 'gallery',
      title: 'אצלנו בדיינר',
      button: settings.instagram_url
        ? { label: 'עקבו באינסטגרם', href: settings.instagram_url }
        : { label: 'לכל התמונות', href: '/gallery' },
      images: [],
    },
    { id: 'home-location', type: 'location', title: '' },
  ]
}
