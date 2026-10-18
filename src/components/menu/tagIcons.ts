import {
  ChefHat,
  Star,
  Sparkles,
  Vegan,
  Leaf,
  WheatOff,
  Flame,
  Nut,
  Milk,
  Smile,
  type LucideIcon,
} from 'lucide-react'
import type { MenuTagKey } from '@/lib/menu/tags'

export const TAG_ICONS: Record<MenuTagKey, LucideIcon> = {
  chef: ChefHat,
  popular: Star,
  new: Sparkles,
  vegan: Vegan,
  vegetarian: Leaf,
  gluten_free: WheatOff,
  spicy: Flame,
  nuts: Nut,
  dairy: Milk,
  kids: Smile,
}
