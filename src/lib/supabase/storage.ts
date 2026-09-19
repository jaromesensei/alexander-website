import { createClient } from './client'

const BUCKET = 'public-media'

/** מעלה קובץ ל-Storage הציבורי ומחזיר URL ציבורי קבוע. */
export async function uploadPublicImage(file: File, folder: 'menu' | 'gallery' | 'hero') {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${folder}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
