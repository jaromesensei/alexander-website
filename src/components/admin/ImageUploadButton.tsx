'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImagePlus, X } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'
import { MediaLibrary } from './media/MediaLibrary'
import { useUpload } from './media/useUpload'
import type { UploadFolder } from '@/lib/supabase/storage'

/** ריבוע תמונה קומפקטי (תמונת מנה): לחיצה פותחת את ספריית התמונות, אפשר גם לגרור קובץ. */
export function ImageUploadButton({
  value,
  onChange,
  folder,
}: {
  value: string | null
  onChange: (url: string | null) => void
  folder: UploadFolder
}) {
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [over, setOver] = useState(false)
  const { upload, uploading, failed } = useUpload(folder)

  return (
    <div>
      <button
        type="button"
        onClick={() => setLibraryOpen(true)}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={async (e) => {
          e.preventDefault()
          setOver(false)
          const [url] = await upload(Array.from(e.dataTransfer.files).slice(0, 1))
          if (url) onChange(url)
        }}
        aria-label={value ? 'החלפת תמונה' : 'הוספת תמונה'}
        className={cn(
          'border-ink/30 bg-paper-dark relative flex size-24 items-center justify-center overflow-hidden rounded-xl border border-dashed',
          over && 'border-pink outline-pink outline-2',
        )}
      >
        {uploading ? (
          <Spinner className="text-ink-soft size-5" />
        ) : value ? (
          <Image src={value} alt="" fill sizes="96px" className="object-cover" />
        ) : (
          <ImagePlus className="text-ink-soft size-6" />
        )}
      </button>
      {value && !uploading && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-ink-soft hover:text-pink mt-1 flex items-center gap-1 text-xs"
        >
          <X className="size-3" />
          הסרה
        </button>
      )}
      {failed > 0 && <p className="text-pink mt-1 text-xs">העלאה נכשלה</p>}
      {libraryOpen && (
        <MediaLibrary
          folder={folder}
          onSelect={([url]) => onChange(url)}
          onClose={() => setLibraryOpen(false)}
        />
      )}
    </div>
  )
}
