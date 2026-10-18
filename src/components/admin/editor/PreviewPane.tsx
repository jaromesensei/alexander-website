'use client'

import { useEffect, useRef, useState } from 'react'
import {
  PREVIEW_PATH,
  type EditorMessage,
  type PreviewMessage,
} from '@/lib/blocks/previewProtocol'
import { cn } from '@/lib/utils'
import type { Block } from '@/lib/blocks/types'

export type Device = 'mobile' | 'desktop'

const DESKTOP_WIDTH = 1280
const MOBILE_WIDTH = 390

/**
 * iframe של האתר עצמו שמקבל את הבלוקים מהעורך — כך התצוגה זהה לאתר
 * (כולל breakpoints אמיתיים: למסך מחשב ה-iframe ברוחב 1280 ומוקטן להתאמה).
 */
export function PreviewPane({
  blocks,
  selectedId,
  scrollToSelected,
  device,
  onSelect,
}: {
  blocks: Block[]
  selectedId: string | null
  scrollToSelected: boolean
  device: Device
  onSelect: (id: string) => void
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  // גדל בכל פעם שה-iframe נטען מחדש ומדווח שהוא מוכן — ואז שולחים לו שוב את המצב
  const [readyCount, setReadyCount] = useState(0)
  const [box, setBox] = useState({ width: 0, height: 0 })
  const onSelectRef = useRef(onSelect)
  useEffect(() => {
    onSelectRef.current = onSelect
  })

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return
      if (e.source !== iframeRef.current?.contentWindow) return
      const data = e.data as PreviewMessage
      if (data?.source !== 'alex-preview') return
      if (data.type === 'ready') setReadyCount((c) => c + 1)
      if (data.type === 'select') onSelectRef.current(data.id)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    if (readyCount === 0) return
    const message: EditorMessage = {
      source: 'alex-editor',
      type: 'state',
      blocks,
      selectedId,
      scroll: scrollToSelected,
    }
    iframeRef.current?.contentWindow?.postMessage(message, window.location.origin)
  }, [readyCount, blocks, selectedId, scrollToSelected])

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) =>
      setBox({ width: entry.contentRect.width, height: entry.contentRect.height }),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const frameWidth =
    device === 'desktop'
      ? DESKTOP_WIDTH
      : Math.min(MOBILE_WIDTH, box.width || MOBILE_WIDTH)
  const scale = box.width > 0 ? Math.min(1, box.width / frameWidth) : 1
  const frameHeight = box.height > 0 ? box.height / scale : 800

  return (
    <div
      ref={boxRef}
      dir="ltr"
      className="bg-paper-dark relative h-full w-full overflow-hidden"
    >
      <iframe
        ref={iframeRef}
        src={PREVIEW_PATH}
        title="תצוגה מקדימה"
        className={cn(
          'absolute top-0 bg-white',
          device === 'mobile' && 'border-ink/10 border-x',
        )}
        style={{
          width: frameWidth,
          height: frameHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          left:
            device === 'mobile' ? Math.max(0, (box.width - frameWidth * scale) / 2) : 0,
        }}
      />
    </div>
  )
}
