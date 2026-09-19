'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ImageUp, X } from 'lucide-react'
import { uploadPublicImage } from '@/lib/supabase/storage'
import { Spinner } from '@/components/ui/Spinner'

export function ImageUploadButton({
  value,
  onChange,
  folder,
}: {
  value: string | null
  onChange: (url: string | null) => void
  folder: 'menu' | 'gallery' | 'hero'
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setLoading(true)
    try {
      const url = await uploadPublicImage(file, folder)
      onChange(url)
    } catch {
      setError('העלאה נכשלה, נסו שוב')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div
        className="border-charcoal/30 bg-cream-dark relative flex size-24 items-center justify-center overflow-hidden rounded-xl border border-dashed"
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        {loading ? (
          <Spinner className="text-charcoal-soft size-5" />
        ) : value ? (
          <Image src={value} alt="" fill className="object-cover" />
        ) : (
          <ImageUp className="text-charcoal-soft size-6" />
        )}
      </div>
      {value && !loading && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-charcoal-soft hover:text-ketchup mt-1 flex items-center gap-1 text-xs"
        >
          <X className="size-3" />
          הסרה
        </button>
      )}
      {error && <p className="text-ketchup mt-1 text-xs">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
