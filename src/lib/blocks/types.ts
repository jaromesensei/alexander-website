/**
 * מודל הבלוקים של העמודים הדינמיים. כל עמוד = מערך בלוקים שנשמר כ-jsonb
 * בטבלת pages. הטיפוסים כאן הם מקור האמת גם לעורך וגם לרינדור.
 */

/** צבעי רקע מותרים — רק צבעי המותג, כדי שהעיצוב יישאר עקבי. */
export type BlockBg = 'paper' | 'ink' | 'pink' | 'mustard' | 'turquoise'

/** כפתור/קישור. href: נתיב, URL או טוקן פעולה (ראו lib/links.ts). */
export interface LinkValue {
  label: string
  href: string
}

export interface FeatureItem {
  icon: string
  title: string
  text: string
}

interface BlockBase {
  id: string
  hidden?: boolean
  /** מזהה לקישור ישיר לסקשן (/#anchor) */
  anchor?: string
}

export interface HeroBlock extends BlockBase {
  type: 'hero'
  tagline: string
  subtitle: string
  image: string | null
  primary: LinkValue | null
  secondary: LinkValue | null
}

export interface HeadingBlock extends BlockBase {
  type: 'heading'
  title: string
  text: string
  bg: BlockBg
  /** תמונת רקע (עם שכבה כהה) — גוברת על צבע הרקע */
  bgImage?: string | null
}

export interface TextBlock extends BlockBase {
  type: 'text'
  title: string
  text: string
  size: 'md' | 'lg'
  bg: BlockBg
  /** תמונת רקע (עם שכבה כהה) — גוברת על צבע הרקע */
  bgImage?: string | null
  button: LinkValue | null
}

export interface CtaBlock extends BlockBase {
  type: 'cta'
  title: string
  text: string
  /** md = שורה קומפקטית, lg = כותרת גדולה וכפתור מתחת */
  size: 'md' | 'lg'
  bg: BlockBg
  /** תמונת רקע (עם שכבה כהה) — גוברת על צבע הרקע */
  bgImage?: string | null
  button: LinkValue | null
}

export interface ImageTextBlock extends BlockBase {
  type: 'image_text'
  title: string
  text: string
  image: string | null
  imageSide: 'start' | 'end'
  bg: BlockBg
  button: LinkValue | null
}

export interface ImageBlock extends BlockBase {
  type: 'image'
  image: string | null
  caption: string
}

export interface FeaturesBlock extends BlockBase {
  type: 'features'
  title: string
  bg: BlockBg
  button: LinkValue | null
  items: FeatureItem[]
}

export interface FeaturedDishesBlock extends BlockBase {
  type: 'featured_dishes'
  title: string
  limit: number
}

export interface GalleryBlock extends BlockBase {
  type: 'gallery'
  title: string
  button: LinkValue | null
  /** ריק = התמונות הראשונות מהגלריה הכללית */
  images: string[]
}

export interface LocationBlock extends BlockBase {
  type: 'location'
  /** ריק = הכתובת מההגדרות */
  title: string
}

export type Block =
  | HeroBlock
  | HeadingBlock
  | TextBlock
  | CtaBlock
  | ImageTextBlock
  | ImageBlock
  | FeaturesBlock
  | FeaturedDishesBlock
  | GalleryBlock
  | LocationBlock

export type BlockType = Block['type']
