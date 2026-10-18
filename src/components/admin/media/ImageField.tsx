'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  ImageUp,
  Images,
  Trash2,
  X,
} from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'
import { MediaLibrary } from './MediaLibrary'
import { useUpload } from './useUpload'
import type { UploadFolder } from '@/lib/supabase/storage'

/** אזור שמקבל קבצים בגרירה. */
function useDrop(onFiles: (files: File[]) => void) {
  const [over, setOver] = useState(false)
  return {
    over,
    props: {
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault()
        setOver(true)
      },
      onDragLeave: () => setOver(false),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault()
        setOver(false)
        onFiles(Array.from(e.dataTransfer.files))
      },
    },
  }
}

/** תמונה בודדת: תצוגה גדולה, החלפה מהספרייה, העלאה או גרירה. */
export function ImageField({
  value,
  onChange,
  folder,
  aspect = 'aspect-video',
}: {
  value: string | null
  onChange: (url: string | null) => void
  folder: UploadFolder
  aspect?: string
}) {
  const [libraryOpen, setLibraryOpen] = useState(false)
  const { upload, uploading } = useUpload(folder)
  const drop = useDrop(async (files) => {
    const [url] = await upload(files.slice(0, 1))
    if (url) onChange(url)
  })

  return (
    <div {...drop.props}>
      {value ? (
        <div
          className={cn(
            'group bg-paper-dark relative overflow-hidden rounded-xl',
            aspect,
            drop.over && 'outline-pink outline-4',
          )}
        >
          <Image src={value} alt="" fill sizes="440px" className="object-cover" />
          {uploading && (
            <div className="bg-paper/70 absolute inset-0 flex items-center justify-center">
              <Spinner className="size-6" />
            </div>
          )}
          <div className="from-ink/70 absolute inset-x-0 bottom-0 flex justify-end gap-1.5 bg-gradient-to-t to-transparent p-2 pt-8">
            <button
              type="button"
              onClick={() => setLibraryOpen(true)}
              className="bg-paper text-ink flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold"
            >
              <Images className="size-4" />
              החלפה
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="bg-paper text-pink flex size-8 items-center justify-center rounded-lg"
              aria-label="הסרת התמונה"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'border-ink/20 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-6 text-center',
            drop.over && 'border-pink bg-pink/5',
          )}
        >
          {uploading ? (
            <Spinner className="text-ink-soft size-6" />
          ) : (
            <ImagePlus className="text-ink-soft size-7" strokeWidth={1.5} />
          )}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setLibraryOpen(true)}
              className="bg-ink text-paper flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold"
            >
              <Images className="size-4" />
              בחירה מהספרייה
            </button>
            <label className="border-ink/20 hover:border-ink flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold">
              <ImageUp className="size-4" />
              העלאה
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const files = Array.from(e.target.files ?? [])
                  e.target.value = ''
                  const [url] = await upload(files)
                  if (url) onChange(url)
                }}
              />
            </label>
          </div>
          <p className="text-ink-soft text-xs">או גררו תמונה לכאן</p>
        </div>
      )}

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

/** כמה תמונות: רשת עם הזזה והסרה, הוספה מהספרייה (בחירה מרובה) או בגרירה. */
export function ImagesField({
  value,
  onChange,
  folder,
}: {
  value: string[]
  onChange: (urls: string[]) => void
  folder: UploadFolder
}) {
  const [libraryOpen, setLibraryOpen] = useState(false)
  const { upload, uploading, pending } = useUpload(folder)
  const drop = useDrop(async (files) => {
    const urls = await upload(files)
    if (urls.length) onChange([...value, ...urls])
  })

  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div
      {...drop.props}
      className={cn('rounded-xl', drop.over && 'outline-pink outline-4 outline-offset-4')}
    >
      <div className="grid grid-cols-3 gap-2">
        {value.map((url, i) => (
          <div
            key={url}
            className="group bg-paper-dark relative aspect-square overflow-hidden rounded-lg"
          >
            <Image src={url} alt="" fill sizes="140px" className="object-cover" />
            <div className="bg-ink/60 absolute inset-x-0 bottom-0 flex justify-between p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
              <span className="flex">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-paper rounded p-0.5 disabled:opacity-30"
                  aria-label="הזזה קדימה"
                >
                  <ChevronRight className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  className="text-paper rounded p-0.5 disabled:opacity-30"
                  aria-label="הזזה אחורה"
                >
                  <ChevronLeft className="size-4" />
                </button>
              </span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="text-paper rounded p-0.5"
                aria-label="הסרת תמונה"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          className="border-ink/20 text-ink-soft hover:border-pink hover:text-pink flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-xs font-semibold"
        >
          {uploading ? (
            <>
              <Spinner className="size-5" />
              {pending}
            </>
          ) : (
            <>
              <ImagePlus className="size-5" />
              הוספה
            </>
          )}
        </button>
      </div>

      {libraryOpen && (
        <MediaLibrary
          folder={folder}
          multiple
          onSelect={(urls) =>
            onChange([...value, ...urls.filter((u) => !value.includes(u))])
          }
          onClose={() => setLibraryOpen(false)}
        />
      )}
    </div>
  )
}
