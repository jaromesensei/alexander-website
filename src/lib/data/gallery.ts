import { createPublicClient } from '@/lib/supabase/public'
import { cached } from './cache'
import { FALLBACK_GALLERY } from './fallback'
import type { GalleryImage } from '@/types/db'

const getCachedGallery = cached(async () => {
  const { data, error } = await createPublicClient()
    .from('gallery_images')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return (data as GalleryImage[] | null) ?? []
}, 'gallery')

export async function getGallery(): Promise<GalleryImage[]> {
  try {
    return await getCachedGallery()
  } catch {
    return FALLBACK_GALLERY
  }
}
