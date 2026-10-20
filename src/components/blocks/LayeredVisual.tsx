'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { LayerImage } from '@/lib/blocks/types'

/** גבולות התוכן (לא השקוף) בתוך תמונת השכבה, כשבר מגובה התמונה */
interface LayerBounds {
  top: number
  bottom: number
}

const DEFAULT_BOUNDS: LayerBounds = { top: 0.35, bottom: 0.65 }

/**
 * מודד כמה גבוה המרכיב בכל שכבה (לפי השקיפות), כדי שהשכבות יישבו זו על זו כמו
 * במנה אמיתית — לחמנייה עבה, בצל דק — ולא במרווחים קבועים. ציור קטן (64px)
 * על canvas; אם התמונה לא ניתנת לקריאה, ברירת מחדל באמצע.
 */
function useLayerBounds(urls: string[]) {
  const key = urls.join('|')
  const [bounds, setBounds] = useState<LayerBounds[] | null>(null)

  useEffect(() => {
    let cancelled = false
    const size = 64
    Promise.all(
      urls.map(
        (url) =>
          new Promise<LayerBounds>((resolve) => {
            const img = new window.Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
              try {
                const canvas = document.createElement('canvas')
                canvas.width = canvas.height = size
                const ctx = canvas.getContext('2d')!
                ctx.drawImage(img, 0, 0, size, size)
                const data = ctx.getImageData(0, 0, size, size).data
                let first = -1
                let last = -1
                for (let y = 0; y < size; y++) {
                  for (let x = 0; x < size; x++) {
                    if (data[(y * size + x) * 4 + 3] > 40) {
                      if (first < 0) first = y
                      last = y
                      break
                    }
                  }
                }
                resolve(
                  first < 0
                    ? DEFAULT_BOUNDS
                    : { top: first / size, bottom: (last + 1) / size },
                )
              } catch {
                resolve(DEFAULT_BOUNDS)
              }
            }
            img.onerror = () => resolve(DEFAULT_BOUNDS)
            img.src = url
          }),
      ),
    ).then((result) => {
      if (!cancelled) setBounds(result)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return bounds
}

/** רוחב תמונת השכבה ביחס לרוחב הכרטיס, לפני הקטנה */
const LAYER_WIDTH = 0.72
/** כמה כל שכבה נכנסת בשכבה שמתחתיה כשהמנה סגורה (חלק מהגובה של הדקה מביניהן) */
const CLOSED_OVERLAP = 0.45
/** המרווח בין שכבות כשהמנה פתוחה, בחלקים מגובה הכרטיס */
const OPEN_GAP = 0.03

/** גובה הכרטיס ביחס לרוחבו (aspect-[4/5]) */
const BOX_HEIGHT = 5 / 4

/** מיקום כל שכבה והגודל שלה, במצב סגור או פתוח. כל המידות ביחידות של רוחב הכרטיס */
function stackLayout(bounds: LayerBounds[], open: boolean) {
  const heights = bounds.map((b) => (b.bottom - b.top) * LAYER_WIDTH)
  const overlaps = heights
    .slice(1)
    .map((h, i) => (open ? -OPEN_GAP : CLOSED_OVERLAP * Math.min(h, heights[i])))
  const sum = heights.reduce((a, b) => a + b, 0)
  const joined = sum - overlaps.reduce((a, b) => a + b, 0)
  // סגורה — המנה גדולה וממלאת את הכרטיס; פתוחה — קטנה מעט כדי שהכול ייכנס
  const target = (open ? 0.92 : 0.78) * BOX_HEIGHT
  const scale = Math.min(1.25, target / joined)
  let y = BOX_HEIGHT / 2 - (joined * scale) / 2
  return bounds.map((b, i) => {
    const contentTop = y
    y += heights[i] * scale - (overlaps[i] ?? 0) * scale
    return {
      scale,
      // הטרנספורם מתחיל מראש התמונה, לא מראש המרכיב
      imageTop: contentTop - b.top * LAYER_WIDTH * scale,
      center: contentTop + (heights[i] * scale) / 2,
    }
  })
}

/**
 * תמונה בשכבות: כל שכבה היא תמונה ריבועית באותו גודל עם רקע שקוף. סגורה —
 * השכבות יושבות זו על זו (נראית כמו המנה); פתוחה — מתרחקות ושם המרכיב מופיע.
 * רק transform ו-opacity, בפתיחה מדורג מלמעלה ובסגירה מהיר יותר.
 */
export function LayeredVisual({ layers, open }: { layers: LayerImage[]; open: boolean }) {
  const n = layers.length
  const bounds = useLayerBounds(layers.map((l) => l.image_url))
  const ready = bounds !== null
  const layout = stackLayout(bounds ?? layers.map(() => DEFAULT_BOUNDS), open)
  const labels = stackLayout(bounds ?? layers.map(() => DEFAULT_BOUNDS), true)

  return (
    <div className="absolute inset-0">
      <ul
        className={cn(
          'absolute inset-0 transition-opacity duration-300 ease-out',
          !ready && 'opacity-0',
        )}
      >
        {layers.map((layer, i) => (
          <li key={i}>
            <div
              className="absolute end-0 top-0 aspect-square origin-top transition-transform ease-out motion-reduce:transition-none"
              style={{
                width: `${LAYER_WIDTH * 100}%`,
                zIndex: n - i,
                // אחוזים ב-translateY = מגובה התמונה (= LAYER_WIDTH מרוחב הכרטיס)
                transform: `translateY(${(layout[i].imageTop / LAYER_WIDTH) * 100}%) scale(${layout[i].scale})`,
                transitionDuration: open ? '650ms' : '300ms',
                transitionDelay: open ? `${i * 40}ms` : '0ms',
              }}
            >
              <Image
                src={layer.image_url}
                alt=""
                fill
                sizes="30vw"
                className="object-contain"
              />
            </div>
            {/* שם המרכיב עם קו מוביל — בצד ההתחלה, ליד המרכיב, רק כשהמנה פתוחה */}
            <span
              className={cn(
                'absolute start-3 flex w-[30%] -translate-y-1/2 items-center gap-1.5 text-xs font-bold transition-opacity ease-out sm:text-sm',
                open && ready ? 'opacity-100 duration-300' : 'opacity-0 duration-150',
              )}
              style={{
                top: `${(labels[i].center / BOX_HEIGHT) * 100}%`,
                transitionDelay: open ? `${300 + i * 40}ms` : '0ms',
              }}
            >
              <span className="leading-tight">{layer.label}</span>
              <span aria-hidden="true" className="bg-ink/40 h-px flex-1" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
