'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, ImageUp, X } from 'lucide-react'
import { listMedia, type MediaItem, type UploadFolder } from '@/lib/supabase/storage'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'
import { useUpload } from './useUpload'

// נשמר בין פתיחות כדי שהספרייה תיפתח מיד; מתרענן ברקע בכל פתיחה
let cache: MediaItem[] | null = null

/**
 * ספריית מדיה: כל התמונות שהועלו לאתר + העלאה חדשה (כולל גרירה).
 * במצב בודד — בחירה סוגרת מיד. במצב מרובה — מסמנים ולוחצים "הוספה".
 */
export function MediaLibrary({
  folder,
  multiple = false,
  onSelect,
  onClose,
}: {
  folder: UploadFolder
  multiple?: boolean
  onSelect: (urls: string[]) => void
  onClose: () => void
}) {
  const [items, setItems] = useState<MediaItem[] | null>(cache)
  const [selected, setSelected] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const { upload, uploading, pending, failed } = useUpload(folder)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    let cancelled = false
    listMedia()
      .then((list) => {
        cache = list
        if (!cancelled) setItems(list)
      })
      .catch(() => {
        if (!cancelled) setItems((i) => i ?? [])
      })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current()
    window.addEventListener('keydown', onKey)
    return () => {
      cancelled = true
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const handleFiles = useCallback(
    async (files: File[]) => {
      const urls = await upload(files)
      if (urls.length === 0) return
      const now = new Date().toISOString()
      const added = urls.map((url) => ({ url, createdAt: now }))
      cache = [...added, ...(cache ?? [])]
      setItems((i) => [...added, ...(i ?? [])])
      if (!multiple) {
        onSelect([urls[0]])
        onClose()
      } else {
        setSelected((s) => [...s, ...urls])
      }
    },
    [upload, multiple, onSelect, onClose],
  )

  function toggle(url: string) {
    if (!multiple) {
      onSelect([url])
      onClose()
      return
    }
    setSelected((s) => (s.includes(url) ? s.filter((u) => u !== url) : [...s, url]))
  }

  return (
    <div
      className="bg-ink/50 fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="ספריית תמונות"
        onClick={(e) => e.stopPropagation()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(e) => {
          if (e.currentTarget === e.target) setDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(Array.from(e.dataTransfer.files))
        }}
        className="relative flex max-h-[90svh] w-full flex-col overflow-hidden rounded-t-2xl bg-white sm:max-w-3xl sm:rounded-2xl"
      >
        <div className="border-ink/10 flex items-center gap-3 border-b p-4">
          <h2 className="flex-1 text-xl">ספריית תמונות</h2>
          <label
            className={cn(
              'bg-ink text-paper hover:bg-ink-soft flex h-10 cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-bold',
              uploading && 'pointer-events-none opacity-60',
            )}
          >
            {uploading ? <Spinner className="size-4" /> : <ImageUp className="size-4" />}
            {uploading ? `מעלה ${pending}…` : 'העלאה'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFiles(Array.from(e.target.files))
                e.target.value = ''
              }}
            />
          </label>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-soft hover:bg-paper-dark rounded-lg p-2"
            aria-label="סגירה"
          >
            <X className="size-5" />
          </button>
        </div>

        {failed > 0 && (
          <p className="bg-pink/10 text-pink px-4 py-2 text-sm">
            {failed} קבצים לא הועלו. נסו שוב.
          </p>
        )}

        <div className="min-h-48 flex-1 overflow-y-auto p-4">
          {items === null ? (
            <div className="flex h-40 items-center justify-center">
              <Spinner className="text-ink-soft size-6" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-ink-soft flex h-40 flex-col items-center justify-center gap-2 text-center text-sm">
              <ImageUp className="size-8" strokeWidth={1.5} />
              עוד אין תמונות. העלו או גררו לכאן.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {items.map((item) => {
                const index = selected.indexOf(item.url)
                return (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => toggle(item.url)}
                    className={cn(
                      'bg-paper-dark relative aspect-square overflow-hidden rounded-lg outline-offset-2',
                      index >= 0
                        ? 'outline-pink outline-4'
                        : 'hover:outline-ink/30 hover:outline-2',
                    )}
                  >
                    <Image
                      src={item.url}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                    {index >= 0 && (
                      <span className="bg-pink text-paper absolute end-1.5 top-1.5 flex size-6 items-center justify-center rounded-full text-xs font-bold">
                        {multiple ? index + 1 : <Check className="size-4" />}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {multiple && (
          <div className="border-ink/10 flex items-center justify-between gap-3 border-t p-4">
            <span className="text-ink-soft text-sm">
              {selected.length > 0 ? `נבחרו ${selected.length}` : 'בחרו תמונות'}
            </span>
            <Button
              disabled={selected.length === 0}
              onClick={() => {
                onSelect(selected)
                onClose()
              }}
            >
              הוספה
            </Button>
          </div>
        )}

        {dragging && (
          <div className="bg-pink/10 border-pink text-pink pointer-events-none absolute inset-2 flex items-center justify-center rounded-xl border-4 border-dashed text-lg font-bold">
            שחררו כדי להעלות
          </div>
        )}
      </div>
    </div>
  )
}
