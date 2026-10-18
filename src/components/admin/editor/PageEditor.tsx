'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Monitor,
  Plus,
  Smartphone,
  Trash2,
  Undo2,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { publishContent } from '@/app/admin/actions'
import { BLOCK_DEFS, BLOCK_TYPES, blockSummary, newBlockId } from '@/lib/blocks/defs'
import { HOME_SLUG, RESERVED_SLUGS } from '@/lib/data/pages'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { BlockForm } from './BlockForm'
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

  function changeBlocks(next: (bs: Block[]) => Block[]) {
    setBlocks(next)
    setScrollPreview(false)
    setStatus('idle')
  }

  function updateBlock(id: string, patch: Partial<Block>) {
    changeBlocks((bs) => bs.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)))
  }

  function move(index: number, dir: -1 | 1) {
    changeBlocks((bs) => {
      const j = index + dir
      if (j < 0 || j >= bs.length) return bs
      const next = [...bs]
      ;[next[index], next[j]] = [next[j], next[index]]
      return next
    })
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

  function remove(block: Block) {
    if (!confirm(`למחוק את הבלוק "${BLOCK_DEFS[block.type].label}"?`)) return
    changeBlocks((bs) => bs.filter((b) => b.id !== block.id))
    if (selectedId === block.id) setSelectedId(null)
  }

  function setMetaField<K extends keyof Meta>(key: K, value: Meta[K]) {
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

  const saveRef = useRef(save)
  useEffect(() => {
    saveRef.current = save
  })
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        saveRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function revert() {
    if (!confirm('לבטל את כל השינויים מאז השמירה האחרונה?')) return
    const snapshot = JSON.parse(saved) as { meta: Meta; blocks: Block[] }
    setMeta(snapshot.meta)
    setBlocks(snapshot.blocks)
    setStatus('idle')
    setError(null)
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
    <div className="-m-4 flex h-[calc(100svh-3.5rem)] flex-col sm:-m-8 sm:h-svh">
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
        {dirty && (
          <IconButton label="ביטול השינויים" onClick={revert}>
            <Undo2 className="size-5" />
          </IconButton>
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

          <div className="space-y-2">
            {blocks.map((block, i) => {
              const def = BLOCK_DEFS[block.type]
              const Icon = def.icon
              const selected = block.id === selectedId
              return (
                <div
                  key={block.id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(block.id, el)
                    else cardRefs.current.delete(block.id)
                  }}
                  className={cn(
                    'scroll-mt-3 rounded-2xl border bg-white transition-colors',
                    selected ? 'border-pink' : 'border-ink/10',
                  )}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={selected}
                    onClick={() => (selected ? setSelectedId(null) : select(block.id))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') select(block.id)
                    }}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 p-3',
                      block.hidden && 'opacity-50',
                    )}
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
                    <span className="flex shrink-0 items-center">
                      <IconButton
                        label={block.hidden ? 'הצגה באתר' : 'הסתרה מהאתר'}
                        active={block.hidden}
                        onClick={() => updateBlock(block.id, { hidden: !block.hidden })}
                      >
                        {block.hidden ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </IconButton>
                      <IconButton
                        label="הזזה למעלה"
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                      >
                        <ChevronUp className="size-4" />
                      </IconButton>
                      <IconButton
                        label="הזזה למטה"
                        disabled={i === blocks.length - 1}
                        onClick={() => move(i, 1)}
                      >
                        <ChevronDown className="size-4" />
                      </IconButton>
                    </span>
                  </div>

                  {selected && (
                    <div className="border-ink/10 space-y-4 border-t p-4">
                      <BlockForm
                        block={block}
                        linkOptions={linkOptions}
                        onChange={(patch) => updateBlock(block.id, patch)}
                      />
                      <div className="border-ink/10 flex flex-wrap items-center gap-2 border-t pt-3">
                        <button
                          type="button"
                          onClick={() => setPickerOpen(true)}
                          className="text-pink flex items-center gap-1 text-sm font-semibold hover:underline"
                        >
                          <Plus className="size-4" />
                          בלוק חדש מתחת
                        </button>
                        <span className="flex-1" />
                        <button
                          type="button"
                          onClick={() => duplicate(block)}
                          className="text-ink-soft hover:text-ink flex items-center gap-1 text-sm"
                        >
                          <Copy className="size-4" />
                          שכפול
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(block)}
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
            })}
          </div>

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
            טיפ: לחיצה על אזור בתצוגה המקדימה פותחת אותו לעריכה.
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
