import type { CategoryWithItems } from '@/lib/data/menu'
import type { GalleryImage, RestaurantSettings } from '@/types/db'

/** הנתונים שבלוקים צריכים מעבר לתוכן של עצמם. */
export interface BlockContext {
  settings: RestaurantSettings
  categories: CategoryWithItems[]
  gallery: GalleryImage[]
  /** בעורך: בלוק בלי תוכן מציג מציין מקום במקום להיעלם */
  preview?: boolean
}
