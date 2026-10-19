'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { dirForLang } from '@/lib/i18n/languages'
import { MENU_TAGS, TAG_KEYS, normalizeTag, type MenuTagKey } from '@/lib/menu/tags'
import { TAG_ICONS } from './tagIcons'
import { MenuItemCard } from './MenuItemCard'
import type { CategoryWithItems } from '@/lib/data/menu'

export function MenuPageClient({
  categories,
  emptyText,
}: {
  categories: CategoryWithItems[]
  emptyText: string
}) {
  const [active, setActive] = useState<string>(categories[0]?.id ?? '')
  const [filters, setFilters] = useState<MenuTagKey[]>([])
  const { lang } = useLanguage()
  const tabsRef = useRef<HTMLDivElement>(null)
  // אחרי לחיצה על לשונית הדף גולל לקטגוריה — בזמן הזה לא מעדכנים לפי הגלילה
  const lockUntil = useRef(0)

  const allItemEntries = categories.flatMap((c) =>
    c.items.map((i) => ({ id: i.id, scope: 'menu_item' as const })),
  )
  const categoryEntries = categories.map((c) => ({
    id: c.id,
    scope: 'menu_category' as const,
  }))

  // תגיות שבאמת מופיעות בתפריט — רק תגיות התזונה מביניהן מוצעות כמסננים
  const { usedTags, dietFilters } = useMemo(() => {
    const used = new Set(
      categories.flatMap((c) => c.items.flatMap((i) => i.tags.map(normalizeTag))),
    )
    const keys = TAG_KEYS.filter((k) => used.has(k))
    return {
      usedTags: keys,
      dietFilters: keys.filter((k) => MENU_TAGS[k].kind === 'diet'),
    }
  }, [categories])

  const items = useTranslations(allItemEntries)
  const cats = useTranslations(categoryEntries)
  const tags = useTranslations(usedTags.map((id) => ({ id, scope: 'menu_tag' as const })))

  const visible = useMemo(() => {
    if (filters.length === 0) return categories
    return categories
      .map((c) => ({
        ...c,
        items: c.items.filter((i) => {
          const itemTags = i.tags.map(normalizeTag)
          return filters.every((f) => itemTags.includes(f))
        }),
      }))
      .filter((c) => c.items.length > 0)
  }, [categories, filters])

  // הלשונית הפעילה עוקבת אחרי הגלילה: הקטגוריה שהכותרת שלה עברה את הסרגל הדביק
  useEffect(() => {
    const sections = visible
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < lockUntil.current) return
        const hit = entries.find((e) => e.isIntersecting)
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-150px 0px -60% 0px' },
    )
    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [visible])

  // הלשונית הפעילה תמיד גלויה בסרגל (16 קטגוריות לא נכנסות ברוחב טלפון).
  // scrollBy על הסרגל ולא scrollIntoView — זה האחרון היה עוצר את גלילת הדף.
  useEffect(() => {
    const bar = tabsRef.current
    const tab = bar?.querySelector<HTMLElement>(`[data-cat="${active}"]`)
    if (!bar || !tab) return
    const b = bar.getBoundingClientRect()
    const t = tab.getBoundingClientRect()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    bar.scrollBy({
      left: t.left + t.width / 2 - (b.left + b.width / 2),
      behavior: reduce ? 'auto' : 'smooth',
    })
  }, [active])

  if (categories.length === 0) {
    return <p className="text-ink-soft text-center">{emptyText}</p>
  }

  function toggleFilter(key: MenuTagKey) {
    setFilters((f) => (f.includes(key) ? f.filter((k) => k !== key) : [...f, key]))
  }

  const translating = items.isLoading || cats.isLoading || tags.isLoading

  // התוכן המתורגם מסומן בשפה ובכיוון שלו (WCAG 3.1.2), שאר האתר נשאר בעברית
  return (
    <div lang={lang} dir={dirForLang(lang)}>
      <p className="sr-only" role="status" lang="he">
        {translating ? 'התפריט מתורגם…' : ''}
      </p>
      {dietFilters.length > 0 && (
        <div
          className="mb-8 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="סינון לפי העדפה תזונתית"
        >
          {dietFilters.map((key) => {
            const Icon = TAG_ICONS[key]
            const on = filters.includes(key)
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => toggleFilter(key)}
                className={cn(
                  'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors',
                  on
                    ? 'border-ink bg-ink text-paper'
                    : 'border-ink/20 text-ink hover:border-ink',
                )}
              >
                <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                {tags.name(key, MENU_TAGS[key].label)}
              </button>
            )
          })}
          {filters.length > 0 && (
            <button
              type="button"
              onClick={() => setFilters([])}
              lang="he"
              className="text-ink-soft hover:text-ink inline-flex h-9 items-center gap-1 px-2 text-sm font-semibold"
            >
              <X className="size-4" aria-hidden="true" />
              ניקוי
            </button>
          )}
        </div>
      )}

      <div
        ref={tabsRef}
        className="bg-paper/95 border-ink/10 sticky top-18 z-20 -mx-4 mb-12 overflow-x-auto border-b px-4 py-4 backdrop-blur sm:mx-0"
      >
        <div className="flex w-max gap-6">
          {visible.map((c) => (
            <button
              key={c.id}
              type="button"
              data-cat={c.id}
              aria-current={active === c.id ? 'true' : undefined}
              onClick={() => {
                lockUntil.current = Date.now() + 1000
                setActive(c.id)
                const reduce = window.matchMedia(
                  '(prefers-reduced-motion: reduce)',
                ).matches
                document.getElementById(c.id)?.scrollIntoView({
                  behavior: reduce ? 'auto' : 'smooth',
                  block: 'start',
                })
              }}
              className={cn(
                'shrink-0 border-b-2 pb-1 text-base font-semibold transition-colors',
                active === c.id
                  ? 'border-ink text-ink'
                  : 'text-ink-soft hover:text-ink border-transparent',
              )}
            >
              {cats.name(c.id, c.name_he)}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-ink-soft" lang="he" dir="rtl" role="status">
          אין מנות שמתאימות לכל המסננים שבחרתם.
        </p>
      ) : (
        <div className="max-w-3xl space-y-16">
          {visible.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-36">
              <h2 className="mb-2 text-3xl leading-tight sm:text-4xl">
                {cats.name(category.id, category.name_he)}
              </h2>
              {category.description_he && (
                <p className="text-ink-soft mb-2 max-w-2xl whitespace-pre-line">
                  {cats.description(category.id, category.description_he)}
                </p>
              )}
              <div>
                {category.items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    name={items.name(item.id, item.name_he)}
                    description={items.description(item.id, item.description_he)}
                    tagLabel={tags.name}
                    variantLabel={(i, fallback) => items.variant(item.id, i, fallback)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
