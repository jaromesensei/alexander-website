'use client'

import { forwardRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react'
import { BLOCK_DEFS, blockSummary } from '@/lib/blocks/defs'
import { cn } from '@/lib/utils'
import { BlockForm } from './BlockForm'
import { IconButton } from './fields'
import type { LinkOption } from '@/lib/blocks/linkOptions'
import type { Block } from '@/lib/blocks/types'

interface Props {
  block: Block
  selected: boolean
  linkOptions: LinkOption[]
  onToggle: () => void
  onChange: (patch: Partial<Block>) => void
  onDuplicate: () => void
  onRemove: () => void
  onAddBelow: () => void
}

/** כרטיס בלוק ברשימת העורך: ידית גרירה, הסתרה, ובפתיחה — טופס העריכה. */
export const BlockCard = forwardRef<HTMLDivElement, Props>(function BlockCard(
  { block, selected, linkOptions, onToggle, onChange, onDuplicate, onRemove, onAddBelow },
  ref,
) {
  const def = BLOCK_DEFS[block.type]
  const Icon = def.icon
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id })

  return (
    <div
      ref={(el) => {
        setNodeRef(el)
        if (typeof ref === 'function') ref(el)
        else if (ref) ref.current = el
      }}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        'scroll-mt-3 rounded-2xl border bg-white',
        selected ? 'border-pink' : 'border-ink/10',
        isDragging && 'relative z-10 shadow-xl',
      )}
    >
      <div className={cn('flex items-center gap-1 p-2', block.hidden && 'opacity-50')}>
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`גרירה: ${def.label}`}
          className="text-ink-soft hover:bg-paper-dark flex h-10 w-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={selected}
          className="flex min-w-0 flex-1 items-center gap-2 text-start"
        >
          <span className="bg-paper-dark flex size-9 shrink-0 items-center justify-center rounded-lg">
            <Icon className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">
              {def.label}
              {block.hidden && ' · מוסתר'}
            </span>
            <span className="text-ink-soft block truncate text-xs">
              {blockSummary(block) || '—'}
            </span>
          </span>
        </button>
        <IconButton
          label={block.hidden ? 'הצגה באתר' : 'הסתרה מהאתר'}
          active={block.hidden}
          onClick={() => onChange({ hidden: !block.hidden })}
        >
          {block.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </IconButton>
      </div>

      {selected && (
        <div className="border-ink/10 space-y-4 border-t p-4">
          <BlockForm block={block} linkOptions={linkOptions} onChange={onChange} />
          <div className="border-ink/10 flex flex-wrap items-center gap-3 border-t pt-3">
            <button
              type="button"
              onClick={onAddBelow}
              className="text-pink flex items-center gap-1 text-sm font-semibold hover:underline"
            >
              <Plus className="size-4" />
              בלוק חדש מתחת
            </button>
            <span className="flex-1" />
            <button
              type="button"
              onClick={onDuplicate}
              className="text-ink-soft hover:text-ink flex items-center gap-1 text-sm"
            >
              <Copy className="size-4" />
              שכפול
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="text-pink flex items-center gap-1 text-sm"
            >
              <Trash2 className="size-4" />
              מחיקה
            </button>
          </div>
        </div>
      )}
    </div>
  )
})
