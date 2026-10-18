'use client'

import { useState } from 'react'
import { uploadPublicImage, type UploadFolder } from '@/lib/supabase/storage'

/** העלאה של כמה קבצים במקביל (עד 3 בו-זמנית), עם מונה התקדמות. */
export function useUpload(folder: UploadFolder) {
  const [pending, setPending] = useState(0)
  const [failed, setFailed] = useState(0)

  async function upload(files: File[]): Promise<string[]> {
    const images = files.filter((f) => f.type.startsWith('image/'))
    if (images.length === 0) return []
    setFailed(0)
    setPending((p) => p + images.length)
    const results: string[] = []
    const queue = [...images]
    async function worker() {
      for (let file = queue.shift(); file; file = queue.shift()) {
        try {
          results.push(await uploadPublicImage(file, folder))
        } catch {
          setFailed((f) => f + 1)
        } finally {
          setPending((p) => p - 1)
        }
      }
    }
    await Promise.all([worker(), worker(), worker()])
    return results
  }

  return { upload, uploading: pending > 0, pending, failed }
}
