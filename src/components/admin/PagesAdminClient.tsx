'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, FileText, House, Pencil, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { publishContent } from '@/app/admin/actions'
import { BLOCK_DEFS, newBlockId } from '@/lib/blocks/defs'
import { RESERVED_SLUGS } from '@/lib/data/pages'
import { slugify } from '@/lib/slugify'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { Block } from '@/lib/blocks/types'
import type { Page } from '@/types/db'

export function PagesAdminClient({ pages }: { pages: Page[] }) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function create() {
    const finalSlug = slug || slugify(title)
    if (!title.trim()) return setError('חסר שם לעמוד')
    if (!finalSlug) return setError('חסרה כתובת (באנגלית)')
    if (RESERVED_SLUGS.has(finalSlug)) return setError(`/${finalSlug} שמורה לעמוד קבוע`)
    if (pages.some((p) => p.slug === finalSlug))
      return setError(`כבר יש עמוד /${finalSlug}`)

    setBusy(true)
    setError(null)
    const heading = {
      ...BLOCK_DEFS.heading.create(),
      id: newBlockId(),
      title: title.trim(),
    } as Block
    const { data, error: insertError } = await createClient()
      .from('pages')
      .insert({
        title: title.trim(),
        slug: finalSlug,
        blocks: [heading],
        is_published: false,
      })
      .select('id')
      .single()
    setBusy(false)
    if (insertError || !data) {
      setError(
        insertError?.code === '23505'
          ? 'הכתובת כבר תפוסה'
          : 'יצירת העמוד נכשלה. האם המיגרציה 0003 הורצה ב-Supabase?',
      )
      return
    }
    router.push(`/admin/pages/${data.id}`)
  }

  async function remove(page: Page) {
    if (!confirm(`למחוק את העמוד "${page.title}"? אי אפשר לשחזר.`)) return
    await createClient().from('pages').delete().eq('id', page.id)
    await publishContent()
  }

  return (
    <section className="mb-10">
      <ul className="border-ink/10 divide-ink/10 divide-y rounded-2xl border bg-white">
        <PageRow
          icon={<House className="size-4" />}
          title="עמוד הבית"
          path="/"
          published
          editHref="/admin/pages/home"
        />
        {pages.map((page) => (
          <PageRow
            key={page.id}
            icon={<FileText className="size-4" />}
            title={page.title}
            path={`/${page.slug}`}
            published={page.is_published}
            editHref={`/admin/pages/${page.id}`}
            onDelete={() => remove(page)}
          />
        ))}
      </ul>

      {creating ? (
        <div className="border-ink/20 mt-3 space-y-3 rounded-2xl border border-dashed bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>שם העמוד</Label>
              <Input
                autoFocus
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (!slugTouched) setSlug(slugify(e.target.value))
                }}
                placeholder="למשל: אירועים"
              />
            </div>
            <div>
              <Label>כתובת (באנגלית)</Label>
              <div className="flex items-center gap-1" dir="ltr">
                <span className="text-ink-soft">/</span>
                <Input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                  }}
                  placeholder="events"
                />
              </div>
            </div>
          </div>
          {error && <p className="text-pink text-sm">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={create} disabled={busy}>
              {busy ? 'יוצר…' : 'יצירה ומעבר לעריכה'}
            </Button>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              ביטול
            </Button>
          </div>
          <p className="text-ink-soft text-xs">
            העמוד נוצר כטיוטה. אחרי שתסיימו לעצב אותו — סמנו &quot;מפורסם&quot; ושמרו,
            והוסיפו אותו לתפריט הניווט למטה.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="border-ink/20 text-ink-soft hover:border-pink hover:text-pink mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed py-5 text-sm font-semibold"
        >
          <Plus className="size-4" />
          עמוד חדש
        </button>
      )}
    </section>
  )
}

function PageRow({
  icon,
  title,
  path,
  published,
  editHref,
  onDelete,
}: {
  icon: React.ReactNode
  title: string
  path: string
  published: boolean
  editHref: string
  onDelete?: () => void
}) {
  return (
    <li className="flex items-center gap-3 p-3">
      <span className="bg-paper-dark flex size-9 shrink-0 items-center justify-center rounded-lg">
        {icon}
      </span>
      <Link href={editHref} className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{title}</span>
        <span className="text-ink-soft block text-xs" dir="ltr">
          {path}
        </span>
      </Link>
      <span
        className={cn(
          'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
          published ? 'bg-turquoise/30 text-ink' : 'bg-paper-dark text-ink-soft',
        )}
      >
        {published ? 'מפורסם' : 'טיוטה'}
      </span>
      {published && (
        <a
          href={path}
          target="_blank"
          rel="noreferrer"
          className="text-ink-soft hover:bg-paper-dark rounded-lg p-2"
          aria-label={`צפייה ב${title}`}
        >
          <ExternalLink className="size-4" />
        </a>
      )}
      <Link
        href={editHref}
        className="bg-ink text-paper hover:bg-ink-soft flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold"
      >
        <Pencil className="size-3.5" />
        עריכה
      </Link>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="text-pink hover:bg-pink/10 rounded-lg p-2"
          aria-label={`מחיקת ${title}`}
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </li>
  )
}
