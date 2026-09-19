import { createClient } from '@/lib/supabase/server'
import { FALLBACK_GALLERY } from './fallback'
import type { GalleryImage } from '@/types/db'

export async function getGallery(): Promise<GalleryImage[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order')
    if (error || !data) return FALLBACK_GALLERY
    return data as GalleryImage[]
  } catch {
    return FALLBACK_GALLERY
  }
}
