'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { uploadPublicImage } from '@/lib/supabase/storage'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import type { GalleryImage } from '@/types/db'

export function GalleryAdminClient({ images }: { images: GalleryImage[] }) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)

  async function addImages(files: FileList) {
    setUploading(true)
    const supabase = createClient()
    let order = images.length
    for (const file of Array.from(files)) {
      try {
        const url = await uploadPublicImage(file, 'gallery')
        order += 1
        await supabase
          .from('gallery_images')
          .insert({ image_url: url, sort_order: order })
      } catch {
        // ממשיך להעלות את שאר הקבצים גם אם אחד נכשל
      }
    }
    setUploading(false)
    router.refresh()
  }

  async function updateCaption(id: string, caption: string) {
    const supabase = createClient()
    await supabase
      .from('gallery_images')
      .update({ caption_he: caption || null })
      .eq('id', id)
  }

  async function remove(id: string) {
    if (!confirm('להסיר את התמונה?')) return
    const supabase = createClient()
    await supabase.from('gallery_images').delete().eq('id', id)
    router.refresh()
  }

  async function move(index: number, direction: 'up' | 'down') {
    const swapWith = direction === 'up' ? index - 1 : index + 1
    if (swapWith < 0 || swapWith >= images.length) return
    const a = images[index]
    const b = images[swapWith]
    const supabase = createClient()
    await Promise.all([
      supabase.from('gallery_images').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('gallery_images').update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
    router.refresh()
  }

  return (
    <div>
      <label className="border-ink/20 text-ink-soft hover:border-pink hover:text-pink mb-6 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed py-8 text-sm font-semibold">
        {uploading ? (
          <>
            <Spinner className="size-4" /> מעלה תמונות…
          </>
        ) : (
          <>
            <Plus className="size-4" /> העלאת תמונות
          </>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => e.target.files && addImages(e.target.files)}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="border-ink/10 overflow-hidden rounded-2xl border bg-white"
          >
            <div className="relative aspect-square">
              <Image
                src={img.image_url}
                alt={img.caption_he ?? ''}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2 p-3">
              <Input
                defaultValue={img.caption_he ?? ''}
                placeholder="כיתוב (אופציונלי)"
                onBlur={(e) => updateCaption(img.id, e.target.value)}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => move(i, 'up')}
                    className="text-ink-soft hover:bg-paper-dark rounded-lg p-1.5 disabled:opacity-30"
                    aria-label="הזזה"
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    disabled={i === images.length - 1}
                    onClick={() => move(i, 'down')}
                    className="text-ink-soft hover:bg-paper-dark rounded-lg p-1.5 disabled:opacity-30"
                    aria-label="הזזה"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(img.id)}
                  className="text-pink hover:bg-pink/10 rounded-lg p-1.5"
                  aria-label="מחיקה"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
