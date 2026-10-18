import {
  PartyPopper,
  Trophy,
  Cake,
  Briefcase,
  Music,
  Beer,
  Martini,
  Coffee,
  Users,
  Gift,
  Tv,
  Star,
  Heart,
  Clock,
  Calendar,
  UtensilsCrossed,
  Hamburger,
  Flame,
  Sparkles,
  MapPin,
  type LucideIcon,
} from 'lucide-react'

/** אייקונים לבלוק "יתרונות/אירועים". המפתח נשמר במסד, התווית מוצגת בעורך. */
export const FEATURE_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  party: { icon: PartyPopper, label: 'מסיבה' },
  trophy: { icon: Trophy, label: 'ספורט' },
  cake: { icon: Cake, label: 'יום הולדת' },
  briefcase: { icon: Briefcase, label: 'עסקי' },
  music: { icon: Music, label: 'מוזיקה' },
  beer: { icon: Beer, label: 'בירה' },
  martini: { icon: Martini, label: 'קוקטייל' },
  coffee: { icon: Coffee, label: 'קפה' },
  users: { icon: Users, label: 'קבוצה' },
  gift: { icon: Gift, label: 'מתנה' },
  tv: { icon: Tv, label: 'מסך' },
  star: { icon: Star, label: 'כוכב' },
  heart: { icon: Heart, label: 'לב' },
  clock: { icon: Clock, label: 'שעון' },
  calendar: { icon: Calendar, label: 'יומן' },
  utensils: { icon: UtensilsCrossed, label: 'אוכל' },
  burger: { icon: Hamburger, label: 'המבורגר' },
  flame: { icon: Flame, label: 'אש' },
  sparkles: { icon: Sparkles, label: 'ניצוץ' },
  pin: { icon: MapPin, label: 'מיקום' },
}

export function featureIcon(key: string): LucideIcon {
  return (FEATURE_ICONS[key] ?? FEATURE_ICONS.star).icon
}
