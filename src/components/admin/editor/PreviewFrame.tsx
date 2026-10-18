'use client'

import { useEffect, useRef, useState } from 'react'
import { AnchoredBlock } from '@/components/blocks/BlockView'
import { BLOCK_DEFS } from '@/lib/blocks/defs'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/Spinner'
import type { BlockContext } from '@/components/blocks/context'
import type { EditorMessage, PreviewMessage } from '@/lib/blocks/previewProtocol'

function post(message: PreviewMessage) {
  window.parent.postMessage(message, window.location.origin)
}

/** רץ בתוך ה-iframe: מרנדר את הבלוקים שהעורך שולח, בדיוק כמו באתר. */
export function PreviewFrame({ ctx }: { ctx: BlockContext }) {
  const [state, setState] = useState<EditorMessage | null>(null)
  const refs = useRef(new Map<string, HTMLDivElement>())

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return
      const data = e.data as EditorMessage
      if (data?.source !== 'alex-editor' || data.type !== 'state') return
      setState(data)
    }
    // בתצוגה מקדימה קישורים לא מנווטים — לחיצה רק בוחרת בלוק
    function onClick(e: MouseEvent) {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }
    window.addEventListener('message', onMessage)
    document.addEventListener('click', onClick, true)
    post({ source: 'alex-preview', type: 'ready' })
    return () => {
      window.removeEventListener('message', onMessage)
      document.removeEventListener('click', onClick, true)
    }
  }, [])

  useEffect(() => {
    if (!state?.scroll || !state.selectedId) return
    refs.current
      .get(state.selectedId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [state])

  if (!state) {
    return (
      <div className="flex min-h-[50svh] items-center justify-center">
        <Spinner className="text-ink-soft size-6" />
      </div>
    )
  }

  const visible = state.blocks.filter((b) => !b.hidden)
  if (visible.length === 0) {
    return (
      <div className="text-ink-soft flex min-h-[50svh] items-center justify-center p-8 text-center">
        העמוד ריק. הוסיפו בלוק מהעורך.
      </div>
    )
  }

  return (
    <>
      {visible.map((block, i) => {
        const selected = block.id === state.selectedId
        return (
          <div
            key={block.id}
            ref={(el) => {
              if (el) refs.current.set(block.id, el)
              else refs.current.delete(block.id)
            }}
            onClick={() => post({ source: 'alex-preview', type: 'select', id: block.id })}
            className={cn(
              'relative cursor-pointer scroll-mt-20',
              'after:pointer-events-none after:absolute after:inset-0 after:z-30 after:border-4 after:border-transparent after:transition-colors',
              selected ? 'after:border-pink' : 'hover:after:border-pink/40',
            )}
          >
            <AnchoredBlock block={block} ctx={{ ...ctx, preview: true }} index={i} />
            {selected && (
              <span className="bg-pink text-paper absolute start-4 top-4 z-40 px-2.5 py-1 text-xs font-bold">
                {BLOCK_DEFS[block.type].label}
              </span>
            )}
          </div>
        )
      })}
    </>
  )
}
