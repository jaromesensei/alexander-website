import type { GalleryImage, MenuCategory, MenuItem, RestaurantSettings } from '@/types/db'

/**
 * תוכן ברירת מחדל — מוצג כל עוד ה-CMS/Supabase לא הוגדרו או ריקים,
 * כדי שהאתר ייראה מוגמר מהרגע הראשון. מוחלף אוטומטית ברגע שיש נתונים אמיתיים.
 */

export const FALLBACK_SETTINGS: RestaurantSettings = {
  id: 'fallback',
  name: 'אלכסנדר',
  tagline: 'טעם טוב. אנשים טובים. בלי ערבים משעממים.',
  hero_image_url: null,
  about:
    'לא עוד דיינר. אלכסנדר זה המקום שבו המבורגרים, שתייה, מוזיקה וערבים טובים נפגשים. ' +
    'מטבח אמריקאי רטרו בגרסה מודרנית — בלי קיצורי דרך, עם הרבה אישיות.',
  phone: '04-1234567',
  whatsapp: '972500000000',
  email: 'info@alexander-diner.co.il',
  address: 'רחוב הגעתון 12, נהריה',
  map_url: 'https://maps.google.com/?q=נהריה',
  lat: 33.006,
  lng: 35.094,
  hours: {
    '0': { open: '12:00', close: '22:00' },
    '1': { open: '12:00', close: '22:00' },
    '2': { open: '12:00', close: '22:00' },
    '3': { open: '12:00', close: '22:00' },
    '4': { open: '12:00', close: '23:00' },
    '5': { open: '12:00', close: '15:00' },
    '6': null,
  },
  instagram_url: null,
  facebook_url: null,
  promo_active: true,
  promo_title: 'האפי-אַוור של אלכסנדר',
  promo_description: 'ראשון–חמישי, 17:00–19:00. שתייה נבחרת ומנות פתיחה במחיר מיוחד.',
  updated_at: new Date().toISOString(),
}

export const HOURS_LABELS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

export const FALLBACK_CATEGORIES: (MenuCategory & { items: MenuItem[] })[] = [
  {
    id: 'burgers',
    name_he: 'המבורגרים',
    sort_order: 1,
    is_active: true,
    created_at: '',
    items: [
      {
        id: 'classic',
        category_id: 'burgers',
        name_he: 'אלכסנדר קלאסי',
        description_he: '180 גרם בקר טרי, גבינת צ׳דר, חסה, עגבנייה, בצל סגול ורוטב הבית',
        price_agorot: 5400,
        image_url: null,
        is_available: true,
        is_featured: true,
        tags: [],
        sort_order: 1,
        created_at: '',
      },
      {
        id: 'bbq',
        category_id: 'burgers',
        name_he: 'BBQ בייקון',
        description_he: '180 גרם בקר, בייקון פריך, גבינה צהובה, בצל מקורמל ורוטב BBQ',
        price_agorot: 6200,
        image_url: null,
        is_available: true,
        is_featured: true,
        tags: [],
        sort_order: 2,
        created_at: '',
      },
    ],
  },
  {
    id: 'sides',
    name_he: 'תוספות',
    sort_order: 2,
    is_active: true,
    created_at: '',
    items: [
      {
        id: 'fries',
        category_id: 'sides',
        name_he: 'צ׳יפס בית',
        description_he: 'תפוחי אדמה טריים, פריכים מבחוץ ורכים מבפנים',
        price_agorot: 1800,
        image_url: null,
        is_available: true,
        is_featured: false,
        tags: ['צמחוני'],
        sort_order: 1,
        created_at: '',
      },
    ],
  },
  {
    id: 'drinks',
    name_he: 'שתייה',
    sort_order: 3,
    is_active: true,
    created_at: '',
    items: [
      {
        id: 'lemonade',
        category_id: 'drinks',
        name_he: 'לימונדה ביתית',
        description_he: 'סחוטה טרי מדי יום, עם נענע',
        price_agorot: 1600,
        image_url: null,
        is_available: true,
        is_featured: false,
        tags: ['צמחוני'],
        sort_order: 1,
        created_at: '',
      },
    ],
  },
]

export const FALLBACK_GALLERY: GalleryImage[] = []
