export type ReservationStatus = 'new' | 'contacted' | 'confirmed' | 'declined'

export interface RestaurantSettings {
  id: string
  name: string
  tagline: string | null
  about: string | null
  hero_image_url: string | null
  phone: string
  whatsapp: string | null
  email: string | null
  address: string
  map_url: string | null
  lat: number | null
  lng: number | null
  hours: Record<string, { open: string; close: string } | null> // key: 0=ראשון..6=שבת
  instagram_url: string | null
  facebook_url: string | null
  wolt_url: string | null
  tenbis_url: string | null
  updated_at: string
}

export interface MenuCategory {
  id: string
  name_he: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface MenuItem {
  id: string
  category_id: string
  name_he: string
  description_he: string | null
  price_agorot: number
  image_url: string | null
  is_available: boolean
  is_featured: boolean
  tags: string[]
  sort_order: number
  created_at: string
}

/** מטמון תרגומים גנרי: מפתח (lang, source_hash) → טקסט מתורגם. */
export interface TranslationCacheEntry {
  id: string
  lang: string
  source_hash: string
  source_text: string
  translated_text: string
  created_at: string
}

export interface GalleryImage {
  id: string
  image_url: string
  caption_he: string | null
  sort_order: number
  created_at: string
}

export interface ReservationLead {
  id: string
  name: string
  phone: string
  party_size: number
  wanted_date: string
  wanted_time: string
  notes: string | null
  status: ReservationStatus
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any
