import { createClient } from '@/lib/supabase/server'
import { GalleryAdminClient } from '@/components/admin/GalleryAdminClient'
import type { GalleryImage } from '@/types/db'

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('gallery_images').select('*').order('sort_order')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">ניהול גלריה</h1>
        <p className="text-charcoal-soft">תמונות שיוצגו בעמוד הבית ובעמוד הגלריה.</p>
      </div>
      <GalleryAdminClient images={(data as GalleryImage[]) ?? []} />
    </div>
  )
}
