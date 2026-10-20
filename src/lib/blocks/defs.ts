import {
  PanelTop,
  Heading,
  Type,
  Megaphone,
  Columns2,
  ImageIcon,
  LayoutGrid,
  Hamburger,
  Images,
  MapPin,
  GalleryHorizontal,
  type LucideIcon,
} from 'lucide-react'
import type { Block, BlockType } from './types'

/** הגדרת שדה בטופס העריכה. key הוא שם השדה בבלוק. */
export type Field =
  | { key: string; label: string; kind: 'text'; placeholder?: string; help?: string }
  | { key: string; label: string; kind: 'textarea'; rows?: number; help?: string }
  | { key: string; label: string; kind: 'image'; help?: string }
  | { key: string; label: string; kind: 'video'; help?: string }
  | { key: string; label: string; kind: 'images'; help?: string }
  | { key: string; label: string; kind: 'bg' }
  | { key: string; label: string; kind: 'link' }
  | {
      key: string
      label: string
      kind: 'select'
      options: { value: string; label: string }[]
    }
  | {
      key: string
      label: string
      kind: 'number'
      min: number
      max: number
      help?: string
    }
  | { key: string; label: string; kind: 'features' }
  | { key: string; label: string; kind: 'slides' }

export interface BlockDef {
  label: string
  description: string
  icon: LucideIcon
  fields: Field[]
  /** תוכן התחלתי לבלוק חדש */
  create: () => Omit<Block, 'id'>
}

const BG: Field = { key: 'bg', label: 'צבע רקע', kind: 'bg' }
const BUTTON: Field = { key: 'button', label: 'כפתור', kind: 'link' }
const ALIGN: Field = {
  key: 'align',
  label: 'יישור',
  kind: 'select',
  options: [
    { value: 'start', label: 'לימין' },
    { value: 'center', label: 'למרכז' },
  ],
}
const ALT_HELP = 'מה רואים בתמונה, במשפט קצר. מוקרא לאנשים עיוורים (חובת נגישות).'
const BG_IMAGE: Field = {
  key: 'bgImage',
  label: 'תמונת רקע (לא חובה)',
  kind: 'image',
  help: 'מעל התמונה תונח שכבה כהה והטקסט יהיה לבן',
}
const BG_VIDEO: Field = {
  key: 'bgVideo',
  label: 'וידאו רקע (לא חובה)',
  kind: 'video',
  help: 'סרטון קצר (5–10 שניות) שרץ בלולאה בלי קול. MP4, עדיף עד 5MB. כדאי גם תמונת רקע — היא מוצגת עד שהווידאו נטען ולמי שביקש להפחית אנימציות.',
}
const SIZE = (md: string, lg: string): Field => ({
  key: 'size',
  label: 'גודל',
  kind: 'select',
  options: [
    { value: 'md', label: md },
    { value: 'lg', label: lg },
  ],
})

export const BLOCK_DEFS: Record<BlockType, BlockDef> = {
  hero: {
    label: 'פתיח ראשי',
    description: 'הלוגו הענק, סלוגן וכפתורים. מתאים לראש עמוד הבית.',
    icon: PanelTop,
    fields: [
      { key: 'tagline', label: 'סלוגן', kind: 'textarea', rows: 2 },
      { key: 'subtitle', label: 'שורת משנה', kind: 'text' },
      { key: 'image', label: 'תמונת רקע', kind: 'image', help: 'תמונה רחבה ואיכותית' },
      { ...BG_VIDEO, help: 'מוצג בתוך מסך הטלוויזיה. ' + BG_VIDEO.help },
      { key: 'primary', label: 'כפתור ראשי', kind: 'link' },
      { key: 'secondary', label: 'כפתור משני', kind: 'link' },
    ],
    create: () => ({
      type: 'hero',
      tagline: 'טעם טוב. אנשים טובים.',
      subtitle: 'לוקאל דיינר בנהריה',
      image: null,
      primary: { label: 'הזמנת שולחן', href: 'wa:reservation' },
      secondary: { label: 'לתפריט', href: '/menu' },
    }),
  },
  heading: {
    label: 'כותרת עמוד',
    description: 'כותרת גדולה ופסקת פתיחה. מתאים לראש עמוד חדש.',
    icon: Heading,
    fields: [
      { key: 'title', label: 'כותרת', kind: 'textarea', rows: 2 },
      { key: 'text', label: 'טקסט פתיחה', kind: 'textarea', rows: 3 },
      ALIGN,
      BG,
      BG_IMAGE,
      BG_VIDEO,
    ],
    create: () => ({ type: 'heading', title: 'כותרת העמוד', text: '', bg: 'paper' }),
  },
  text: {
    label: 'טקסט',
    description: 'כותרת ופסקה. בגודל "גדול" — משפט אחד חזק על כל הרוחב.',
    icon: Type,
    fields: [
      { key: 'title', label: 'כותרת (לא חובה)', kind: 'text' },
      { key: 'text', label: 'טקסט', kind: 'textarea', rows: 6 },
      SIZE('רגיל', 'גדול ומודגש'),
      ALIGN,
      BG,
      BG_IMAGE,
      BG_VIDEO,
      BUTTON,
    ],
    create: () => ({
      type: 'text',
      title: 'כותרת',
      text: 'כתבו כאן את הטקסט.',
      size: 'md',
      bg: 'paper',
      button: null,
    }),
  },
  cta: {
    label: 'קריאה לפעולה',
    description: 'פס צבעוני עם כותרת וכפתור — מבצע, הזמנה, תפריט.',
    icon: Megaphone,
    fields: [
      { key: 'title', label: 'כותרת', kind: 'textarea', rows: 2 },
      { key: 'text', label: 'טקסט', kind: 'textarea', rows: 2 },
      SIZE('שורה קומפקטית', 'גדול'),
      ALIGN,
      BG,
      BG_IMAGE,
      BG_VIDEO,
      BUTTON,
    ],
    create: () => ({
      type: 'cta',
      title: 'כותרת',
      text: '',
      size: 'md',
      bg: 'mustard',
      button: { label: 'הזמנת שולחן', href: 'wa:reservation' },
    }),
  },
  image_text: {
    label: 'תמונה וטקסט',
    description: 'תמונה לצד כותרת, טקסט וכפתור.',
    icon: Columns2,
    fields: [
      { key: 'image', label: 'תמונה', kind: 'image' },
      { key: 'imageAlt', label: 'תיאור התמונה (לנגישות)', kind: 'text', help: ALT_HELP },
      {
        key: 'imageSide',
        label: 'מיקום התמונה',
        kind: 'select',
        options: [
          { value: 'start', label: 'מימין' },
          { value: 'end', label: 'משמאל' },
        ],
      },
      { key: 'title', label: 'כותרת', kind: 'textarea', rows: 2 },
      { key: 'text', label: 'טקסט', kind: 'textarea', rows: 4 },
      BG,
      BUTTON,
    ],
    create: () => ({
      type: 'image_text',
      title: 'כותרת',
      text: 'כתבו כאן את הטקסט.',
      image: null,
      imageSide: 'start',
      bg: 'paper',
      button: null,
    }),
  },
  image: {
    label: 'תמונה רחבה',
    description: 'תמונה אחת לכל רוחב העמוד.',
    icon: ImageIcon,
    fields: [
      { key: 'image', label: 'תמונה', kind: 'image' },
      { key: 'alt', label: 'תיאור התמונה (לנגישות)', kind: 'text', help: ALT_HELP },
      { key: 'caption', label: 'כיתוב (לא חובה)', kind: 'text' },
    ],
    create: () => ({ type: 'image', image: null, caption: '' }),
  },
  features: {
    label: 'רשימת יתרונות',
    description: 'כמה פריטים עם אייקון — אירועים, שירותים, למה אנחנו.',
    icon: LayoutGrid,
    fields: [
      { key: 'title', label: 'כותרת', kind: 'text' },
      { key: 'items', label: 'פריטים', kind: 'features' },
      BG,
      BUTTON,
    ],
    create: () => ({
      type: 'features',
      title: 'כותרת',
      bg: 'paper',
      button: null,
      items: [
        { icon: 'star', title: 'פריט ראשון', text: 'תיאור קצר' },
        { icon: 'heart', title: 'פריט שני', text: 'תיאור קצר' },
        { icon: 'music', title: 'פריט שלישי', text: 'תיאור קצר' },
      ],
    }),
  },
  featured_dishes: {
    label: 'מנות מומלצות',
    description: "קרוסלה של המנות שמסומנות 'מומלץ' בתפריט, עם תמונה ומחיר.",
    icon: Hamburger,
    fields: [
      { key: 'title', label: 'כותרת', kind: 'text' },
      {
        key: 'limit',
        label: 'כמה מנות להציג',
        kind: 'number',
        min: 1,
        max: 12,
        help: "המנות נבחרות בניהול התפריט: מסמנים 'מומלץ' על המנה. מנה עם שכבות נפתחת למרכיבים כשהיא במרכז.",
      },
    ],
    create: () => ({ type: 'featured_dishes', title: 'המנות שבשבילן באים', limit: 4 }),
  },
  gallery: {
    label: 'גלריית תמונות',
    description: 'רשת תמונות. ריק = התמונות הראשונות מהגלריה הכללית.',
    icon: Images,
    fields: [
      { key: 'title', label: 'כותרת', kind: 'text' },
      {
        key: 'images',
        label: 'תמונות',
        kind: 'images',
        help: 'השאירו ריק כדי להציג את 6 התמונות הראשונות מהגלריה.',
      },
      BUTTON,
    ],
    create: () => ({
      type: 'gallery',
      title: 'אצלנו בדיינר',
      button: { label: 'לכל התמונות', href: '/gallery' },
      images: [],
    }),
  },
  carousel: {
    label: 'קרוסלה',
    description:
      'שקופיות שמחליקים הצידה: תמונה או תמונה מתפרקת לשכבות, כותרת, טקסט וכפתור.',
    icon: GalleryHorizontal,
    fields: [
      { key: 'title', label: 'כותרת', kind: 'text' },
      BG,
      { key: 'slides', label: 'שקופיות', kind: 'slides' },
    ],
    create: () => ({
      type: 'carousel',
      title: 'כותרת הקרוסלה',
      bg: 'paper',
      slides: [
        {
          title: 'שקופית ראשונה',
          text: '',
          badge: '',
          image: null,
          layers: [],
          button: null,
        },
      ],
    }),
  },
  location: {
    label: 'מיקום ושעות',
    description: 'כתובת, טלפון, שעות פתיחה וכפתור ניווט.',
    icon: MapPin,
    fields: [
      {
        key: 'title',
        label: 'כותרת',
        kind: 'text',
        placeholder: 'ריק = הכתובת',
        help: 'הכתובת, הטלפון והשעות עצמם נערכים בהגדרות.',
      },
    ],
    create: () => ({ type: 'location', title: '' }),
  },
}

export const BLOCK_TYPES = Object.keys(BLOCK_DEFS) as BlockType[]

/** תיאור קצר של תוכן הבלוק לרשימה בעורך. */
export function blockSummary(block: Block): string {
  switch (block.type) {
    case 'hero':
      return block.tagline
    case 'image':
      return block.caption
    case 'location':
      return block.title || 'כתובת ושעות מההגדרות'
    case 'text':
      return block.title || block.text
    default:
      return block.title
  }
}

export function newBlockId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `b-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
