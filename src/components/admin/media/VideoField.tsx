'use client'

import { useState } from 'react'
import { Film, Trash2, Upload } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import {
  VIDEO_MAX_BYTES,
  VIDEO_WARN_BYTES,
  uploadPublicVideo,
  type UploadFolder,
} from '@/lib/supabase/storage'

const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1)

/** וידאו רקע: העלאה (MP4/WebM), תצוגה מקדימה והסרה. */
export function VideoField({
  value,
  onChange,
  folder,
}: {
  value: string | null
  onChange: (url: string | null) => void
  folder: UploadFolder
}) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handle(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('video/')) {
      setMessage('הקובץ הזה לא וידאו. אפשר להעלות MP4 או WebM.')
      return
    }
    if (file.size > VIDEO_MAX_BYTES) {
      setMessage(
        `הסרטון שוקל ${mb(file.size)}MB — יותר מדי לרקע (עד ${mb(VIDEO_MAX_BYTES)}MB). קצרו אותו או כווצו אותו ונסו שוב.`,
      )
      return
    }
    setMessage(
      file.size > VIDEO_WARN_BYTES
        ? `הסרטון שוקל ${mb(file.size)}MB. הוא יעלה, אבל בטלפון הוא ייטען לאט — עדיף עד 5MB.`
        : null,
    )
    setUploading(true)
    try {
      onChange(await uploadPublicVideo(file, folder))
    } catch {
      setMessage('ההעלאה נכשלה. בדקו את החיבור ונסו שוב.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {value ? (
        <div className="bg-ink relative aspect-video overflow-hidden rounded-xl">
          <video
            src={value}
            muted
            loop
            playsInline
            autoPlay
            className="size-full object-cover"
          />
          <div className="from-ink/70 absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t to-transparent p-2 pt-8">
            <button
              type="button"
              onClick={() => onChange(null)}
              className="bg-paper text-pink flex size-8 items-center justify-center rounded-lg"
              aria-label="הסרת הווידאו"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <label className="border-ink/20 hover:border-ink flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center">
          {uploading ? (
            <Spinner className="text-ink-soft size-6" />
          ) : (
            <Film className="text-ink-soft size-7" strokeWidth={1.5} />
          )}
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <Upload className="size-4" />
            {uploading ? 'מעלה…' : 'העלאת וידאו'}
          </span>
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              void handle(file)
            }}
          />
        </label>
      )}
      {message && (
        <p className="text-ink-soft mt-2 text-xs" role="status">
          {message}
        </p>
      )}
    </div>
  )
}
