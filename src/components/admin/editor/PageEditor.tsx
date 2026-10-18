'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  ExternalLink,
  Monitor,
  Plus,
  Redo2,
  RotateCcw,
  Smartphone,
  Undo2,
  X,
} from 'lucide-react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { createClient } from '@/lib/supabase/client'
import { publishContent } from '@/app/admin/actions'
import { BLOCK_DEFS, BLOCK_TYPES, newBlockId } from '@/lib/blocks/defs'
import { HOME_SLUG, RESERVED_SLUGS } from '@/lib/data/pages'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { BlockCard } from './BlockCard'
import { FieldShell, IconButton, Input, Textarea } from './fields'
import { PreviewPane, type Device } from './PreviewPane'
import type { LinkOption } from '@/lib/blocks/linkOptions'
import type { Block, BlockType } from '@/lib/blocks/types'

export interface EditorPage {
  id: string | null
  slug: string
  title: string
  description: string
  is_published: boolean
  blocks: Block[]
}

type Meta = Omit<EditorPage, 'id' | 'blocks'>
type Snapshot = { meta: Meta; blocks: Block[] }

/** הקלדות רצופות בתוך הזמן הזה מתאחדות לצעד ביטול אחד */
const MERGE_MS = 700

/** האם השינוי הנוכחי מתאחד עם הקודם (הקלדה רצופה). מעדכן את זמן העריכה האחרונה. */
function mergesWithLast(lastEdit: { current: number }, force: boolean): boolean {
  const now = Date.now()
  const merge = !force && now - lastEdit.current < MERGE_MS
  lastEdit.current = force ? 0 : now
  return merge
}

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/

export function PageEditor({
  initial,
  isHome,
  linkOptions,
  takenSlugs,
}: {
  initial: EditorPage
  isHome: boolean
  linkOptions: LinkOption[]
  takenSlugs: string[]
}) {
  const [pageId, setPageId] = useState(initial.id)
  const [meta, setMeta] = useState<Meta>({
    slug: initial.slug,
    title: initial.title,
    description: initial.description,
    is_published: initial.is_published,
  })
  const [blocks, setBlocks] = useState(initial.blocks)
  const [saved, setSaved] = useState(() => JSON.stringify({ meta, blocks }))
  const dirty = useMemo(
    () => JSON.stringify({ meta, blocks }) !== saved,
    [meta, blocks, saved],
  )

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [scrollPreview, setScrollPreview] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')
  const [device, setDevice] = useState<Device>('mobile')
  const [pickerOpen, setPickerOpen] = useState(false)
  const cardRefs = useRef(new Map<string, HTMLDivElement>())
  const [history, setHistory] = useState<{ past: Snapshot[]; future: Snapshot[] }>({
    past: [],
    future: [],
  })
  const lastEdit = useRef(0)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  /** שומר את המצב הנוכחי בהיסטוריה לפני שינוי. force = פעולה נפרדת (לא הקלדה). */
  function record(force = false) {
    const merge = mergesWithLast(lastEdit, force)
    setHistory((h) => ({
      past: merge ? h.past : [...h.past.slice(-49), { meta, blocks }],
      future: [],
    }))
  }

  function restore(snapshot: Snapshot) {
    setMeta(snapshot.meta)
    setBlocks(snapshot.blocks)
    setScrollPreview(false)
    setStatus('idle')
    setError(null)
    lastEdit.current = 0
  }

  function undo() {
    const prev = history.past.at(-1)
    if (!prev) return
    setHistory({
      past: history.past.slice(0, -1),
      future: [{ meta, blocks }, ...history.future],
    })
    restore(prev)
  }

  function redo() {
    const next = history.future[0]
    if (!next) return
    setHistory({
      past: [...history.past, { meta, blocks }],
      future: history.future.slice(1),
    })
    restore(next)
  }

  useEffect(() => {
    // במסך רחב ברירת המחדל היא תצוגת מחשב; בטלפון — תצוגת טלפון
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.matchMedia('(min-width: 1024px)').matches) setDevice('desktop')
  }, [])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  function select(id: string, fromPreview = false) {
    setSelectedId(id)
    setScrollPreview(!fromPreview)
    if (fromPreview) {
      setMobileView('edit')
      requestAnimationFrame(() =>
        cardRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      )
    }
  }

  function changeBlocks(next: (bs: Block[]) => Block[], discrete = true) {
    record(discrete)
    setBlocks(next)
    setScrollPreview(false)
    setStatus('idle')
  }

  function updateBlock(id: string, patch: Partial<Block>) {
    // הסתרה/הצגה = פעולה נפרדת; שינוי טקסט = הקלדה שמתאחדת
    const discrete = Object.keys(patch).every((k) => k === 'hidden')
    changeBlocks(
      (bs) => bs.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)),
      discrete,
    )
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    changeBlocks((bs) =>
      arrayMove(
        bs,
        bs.findIndex((b) => b.id === active.id),
        bs.findIndex((b) => b.id === over.id),
      ),
    )
    setSelectedId(String(active.id))
    setScrollPreview(true)
  }

  function insertAfterSelected(block: Block) {
    changeBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === selectedId)
      const next = [...bs]
      next.splice(i === -1 ? bs.length : i + 1, 0, block)
      return next
    })
    setSelectedId(block.id)
    setScrollPreview(true)
    requestAnimationFrame(() =>
      cardRefs.current
        .get(block.id)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    )
  }

  function addBlock(type: BlockType) {
    insertAfterSelected({ ...BLOCK_DEFS[type].create(), id: newBlockId() } as Block)
    setPickerOpen(false)
  }

  function duplicate(block: Block) {
    setSelectedId(block.id)
    insertAfterSelected({
      ...structuredClone(block),
      id: newBlockId(),
      anchor: undefined,
    })
  }

  // בלי אישור — אפשר לבטל עם "ביטול פעולה"
  function remove(block: Block) {
    changeBlocks((bs) => bs.filter((b) => b.id !== block.id))
    if (selectedId === block.id) setSelectedId(null)
  }

  function setMetaField<K extends keyof Meta>(key: K, value: Meta[K]) {
    record(key === 'is_published')
    setMeta((m) => ({ ...m, [key]: value }))
    setStatus('idle')
  }

  function validate(): string | null {
    if (isHome) return null
    if (!meta.title.trim()) return 'חסרה כותרת לעמוד'
    if (!SLUG_RE.test(meta.slug)) return 'כתובת העמוד: אותיות באנגלית, מספרים ומקפים בלבד'
    if (RESERVED_SLUGS.has(meta.slug)) return `הכתובת /${meta.slug} שמורה לעמוד קבוע באתר`
    if (takenSlugs.includes(meta.slug)) return `כבר יש עמוד בכתובת /${meta.slug}`
    return null
  }

  const save = useCallback(async () => {
    const invalid = validate()
    if (invalid) {
      setError(invalid)
      setStatus('error')
      return
    }
    setStatus('saving')
    setError(null)

    const supabase = createClient()
    const payload = {
      slug: isHome ? HOME_SLUG : meta.slug,
      title: isHome ? 'עמוד הבית' : meta.title.trim(),
      description: meta.description.trim() || null,
      blocks,
      is_published: isHome ? true : meta.is_published,
      updated_at: new Date().toISOString(),
    }

    const result = pageId
      ? await supabase
          .from('pages')
          .update(payload)
          .eq('id', pageId)
          .select('id')
          .single()
      : await supabase
          .from('pages')
          .upsert(payload, { onConflict: 'slug' })
          .select('id')
          .single()

    if (result.error) {
      setStatus('error')
      setError(
        result.error.code === '23505'
          ? 'הכתובת כבר תפוסה'
          : result.error.code === '42P01' || result.error.code === 'PGRST205'
            ? 'צריך להריץ ב-Supabase את המיגרציה 0003_pages_and_nav.sql'
            : `השמירה נכשלה: ${result.error.message}`,
      )
      return
    }
    if (!pageId && result.data) {
      setPageId(result.data.id)
      if (!isHome) window.history.replaceState(null, '', `/admin/pages/${result.data.id}`)
    }
    await publishContent()
    setSaved(JSON.stringify({ meta, blocks }))
    setStatus('saved')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, meta, pageId, isHome])

  const actions = useRef({ save, undo, redo })
  useEffect(() => {
    actions.current = { save, undo, redo }
  })
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey)) return
      const key = e.key.toLowerCase()
      if (key === 's') {
        e.preventDefault()
        actions.current.save()
        return
      }
      // בתוך שדה טקסט — ביטול/חזרה של הדפדפן עצמו
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable]')) return
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault()
        actions.current.undo()
      } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
        e.preventDefault()
        actions.current.redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /** חזרה לגרסה השמורה — גם היא ניתנת לביטול */
  function revert() {
    record(true)
    restore(JSON.parse(saved) as Snapshot)
  }

  const publicHref = isHome ? '/' : `/${meta.slug}`
  const statusText =
    status === 'saving'
      ? 'שומר…'
      : status === 'error'
        ? error
        : dirty
          ? 'יש שינויים שלא נשמרו'
          : status === 'saved'
            ? 'נשמר ופורסם באתר'
            : null

  return (
    <div className="bg-paper fixed inset-0 z-40 flex flex-col">
      {/* סרגל עליון */}
      <div className="border-ink/10 flex h-14 shrink-0 items-center gap-2 border-b bg-white px-3 sm:px-4">
        <Link
          href="/admin/pages"
          className="text-ink-soft hover:bg-paper-dark rounded-lg p-2"
          aria-label="חזרה לרשימת העמודים"
        >
          <ArrowRight className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">
            {isHome ? 'עמוד הבית' : meta.title || 'עמוד חדש'}
          </p>
          {statusText && (
            <p
              className={cn(
                'truncate text-xs',
                status === 'error' ? 'text-pink' : 'text-ink-soft',
              )}
              role={status === 'error' ? 'alert' : undefined}
            >
              {statusText}
            </p>
          )}
        </div>
        <IconButton
          label="ביטול פעולה (Ctrl+Z)"
          onClick={undo}
          disabled={history.past.length === 0}
        >
          <Undo2 className="size-5" />
        </IconButton>
        <IconButton
          label="חזרה על פעולה (Ctrl+Y)"
          onClick={redo}
          disabled={history.future.length === 0}
        >
          <Redo2 className="size-5" />
        </IconButton>
        {dirty && (
          <span className="hidden sm:inline-flex">
            <IconButton label="חזרה לגרסה השמורה" onClick={revert}>
              <RotateCcw className="size-5" />
            </IconButton>
          </span>
        )}
        {pageId && (isHome || meta.is_published) && !dirty && (
          <a
            href={publicHref}
            target="_blank"
            rel="noreferrer"
            className="text-ink-soft hover:bg-paper-dark rounded-lg p-2"
            aria-label="צפייה באתר"
            title="צפייה באתר"
          >
            <ExternalLink className="size-5" />
          </a>
        )}
        <Button
          size="sm"
          onClick={save}
          disabled={status === 'saving' || (!dirty && pageId !== null)}
          variant={dirty || !pageId ? 'primary' : 'outline'}
        >
          {status === 'saving' ? (
            'שומר…'
          ) : !dirty && pageId ? (
            <>
              <Check className="size-4" /> נשמר
            </>
          ) : (
            'שמירה ופרסום'
          )}
        </Button>
      </div>

      {/* מעבר עריכה/תצוגה — טלפון בלבד */}
      <div className="border-ink/10 grid shrink-0 grid-cols-2 border-b bg-white lg:hidden">
        {(['edit', 'preview'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setMobileView(v)}
            aria-pressed={mobileView === v}
            className={cn(
              'border-b-2 py-2.5 text-sm font-semibold',
              mobileView === v
                ? 'border-ink text-ink'
                : 'text-ink-soft border-transparent',
            )}
          >
            {v === 'edit' ? 'עריכה' : 'תצוגה מקדימה'}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(360px,440px)_1fr]">
        {/* עורך */}
        <div
          className={cn(
            'bg-paper-dark/50 border-ink/10 h-full overflow-y-auto overscroll-contain p-3 sm:p-4 lg:border-e',
            mobileView === 'preview' && 'hidden lg:block',
          )}
        >
          {!isHome && <PageSettings meta={meta} onChange={setMetaField} />}

          <DndContext
            id="blocks-dnd"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
            accessibility={{
              screenReaderInstructions: {
                draggable: 'להזזה: רווח כדי להרים, חצים כדי להזיז, רווח כדי לשחרר.',
              },
            }}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {blocks.map((block) => (
                  <BlockCard
                    key={block.id}
                    ref={(el) => {
                      if (el) cardRefs.current.set(block.id, el)
                      else cardRefs.current.delete(block.id)
                    }}
                    block={block}
                    selected={block.id === selectedId}
                    linkOptions={linkOptions}
                    onToggle={() =>
                      block.id === selectedId ? setSelectedId(null) : select(block.id)
                    }
                    onChange={(patch) => updateBlock(block.id, patch)}
                    onDuplicate={() => duplicate(block)}
                    onRemove={() => remove(block)}
                    onAddBelow={() => setPickerOpen(true)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button
            type="button"
            onClick={() => {
              setSelectedId(null)
              setPickerOpen(true)
            }}
            className="border-ink/20 text-ink-soft hover:border-pink hover:text-pink mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed py-5 text-sm font-semibold"
          >
            <Plus className="size-4" />
            הוספת בלוק
          </button>
          <p className="text-ink-soft mt-4 pb-6 text-center text-xs">
            טיפ: לחיצה על אזור בתצוגה המקדימה פותחת אותו לעריכה. גוררים בידית ⋮⋮ כדי לשנות
            סדר.
          </p>
        </div>

        {/* תצוגה מקדימה */}
        <div
          className={cn(
            'flex h-full flex-col',
            mobileView === 'edit' && 'hidden lg:flex',
          )}
        >
          <div className="border-ink/10 flex h-11 shrink-0 items-center justify-center gap-1 border-b bg-white">
            {(
              [
                ['mobile', Smartphone, 'טלפון'],
                ['desktop', Monitor, 'מחשב'],
              ] as const
            ).map(([d, Icon, label]) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                aria-pressed={device === d}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold',
                  device === d
                    ? 'bg-ink text-paper'
                    : 'text-ink-soft hover:bg-paper-dark',
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1">
            <PreviewPane
              blocks={blocks}
              selectedId={selectedId}
              scrollToSelected={scrollPreview}
              device={device}
              onSelect={(id) => select(id, true)}
            />
          </div>
        </div>
      </div>

      {pickerOpen && (
        <BlockPicker onPick={addBlock} onClose={() => setPickerOpen(false)} />
      )}
    </div>
  )
}

function PageSettings({
  meta,
  onChange,
}: {
  meta: Meta
  onChange: <K extends keyof Meta>(key: K, value: Meta[K]) => void
}) {
  return (
    <details
      className="border-ink/10 mb-3 rounded-2xl border bg-white"
      open={!meta.title}
    >
      <summary className="cursor-pointer p-3 text-sm font-semibold">
        הגדרות העמוד
        <span
          className={cn(
            'ms-2 rounded-full px-2 py-0.5 text-xs',
            meta.is_published ? 'bg-turquoise text-ink' : 'bg-paper-dark text-ink-soft',
          )}
        >
          {meta.is_published ? 'מפורסם' : 'טיוטה'}
        </span>
      </summary>
      <div className="border-ink/10 space-y-4 border-t p-4">
        <FieldShell label="שם העמוד" help="מופיע בלשונית הדפדפן ובגוגל">
          <Input value={meta.title} onChange={(e) => onChange('title', e.target.value)} />
        </FieldShell>
        <FieldShell label="כתובת" help="באנגלית, למשל events">
          <div className="flex items-center gap-1" dir="ltr">
            <span className="text-ink-soft">/</span>
            <Input
              value={meta.slug}
              onChange={(e) =>
                onChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
              }
            />
          </div>
        </FieldShell>
        <FieldShell label="תיאור לגוגל (לא חובה)">
          <Textarea
            rows={2}
            value={meta.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </FieldShell>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={meta.is_published}
            onChange={(e) => onChange('is_published', e.target.checked)}
          />
          מפורסם באתר
        </label>
      </div>
    </details>
  )
}

function BlockPicker({
  onPick,
  onClose,
}: {
  onPick: (type: BlockType) => void
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="bg-ink/40 fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="בחירת בלוק"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85svh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 sm:max-w-2xl sm:rounded-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl">איזה בלוק להוסיף?</h2>
          <IconButton label="סגירה" onClick={onClose}>
            <X className="size-5" />
          </IconButton>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {BLOCK_TYPES.map((type) => {
            const def = BLOCK_DEFS[type]
            const Icon = def.icon
            return (
              <button
                key={type}
                type="button"
                onClick={() => onPick(type)}
                className="border-ink/10 hover:border-pink flex items-start gap-3 rounded-xl border p-3 text-start"
              >
                <span className="bg-paper-dark flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold">{def.label}</span>
                  <span className="text-ink-soft block text-sm">{def.description}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
