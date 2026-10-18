import { createClient } from './client'
import { compressImage } from '@/lib/image/compress'

const BUCKET = 'public-media'

export const UPLOAD_FOLDERS = ['pages', 'popups', 'hero', 'gallery', 'menu'] as const
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number]

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

export interface MediaItem {
  url: string
  createdAt: string
}

/** כל התמונות שהועלו אי פעם (מכל התיקיות), מהחדשה לישנה — לספריית המדיה. */
export async function listMedia(): Promise<MediaItem[]> {
  const supabase = createClient()
  const bucket = supabase.storage.from(BUCKET)
  const lists = await Promise.all(
    UPLOAD_FOLDERS.map(async (folder) => {
      const { data } = await bucket.list(folder, {
        limit: 500,
        sortBy: { column: 'created_at', order: 'desc' },
      })
      return (data ?? [])
        .filter((o) => o.id && /\.(webp|jpe?g|png|gif|avif)$/i.test(o.name))
        .map((o) => ({
          url: bucket.getPublicUrl(`${folder}/${o.name}`).data.publicUrl,
          createdAt: o.created_at ?? '',
        }))
    }),
  )
  return lists.flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
