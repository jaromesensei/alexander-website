import { createClient } from './client'
import { compressImage } from '@/lib/image/compress'

const BUCKET = 'public-media'

export type UploadFolder = 'menu' | 'gallery' | 'hero' | 'pages'

/** מכווץ ומעלה קובץ ל-Storage הציבורי ומחזיר URL ציבורי קבוע. */
export async function uploadPublicImage(original: File, folder: UploadFolder) {
  const file = await compressImage(original)
  const supabase = createClient()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${folder}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type || undefined,
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
