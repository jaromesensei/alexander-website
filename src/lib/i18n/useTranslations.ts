'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from './LanguageProvider'

export type TranslationScope = 'menu_item' | 'menu_category'

export interface TranslatableEntry {
  id: string
  scope: TranslationScope
}

/**
 * מתרגם קבוצת ישויות (מנות/קטגוריות) לשפה הנוכחית.
 * ב-he מחזיר את המקור ללא קריאת רשת. אחרת קורא ל-/api/translate, שמביא
 * את הטקסט המקורי מה-DB לפי id (לא סומך על תוכן מהקליינט) וממטמן תרגומים
 * כדי שכל טקסט יתורגם פעם אחת בלבד עבור כל שפה.
 */
export function useTranslations(entries: TranslatableEntry[]) {
  const { lang } = useLanguage()
  const [translated, setTranslated] = useState<
    Record<string, { name: string; description?: string }>
  >({})
  const [isLoading, setIsLoading] = useState(false)
  const cache = useRef<
    Map<string, Record<string, { name: string; description?: string }>>
  >(new Map())

  const key = entries.map((e) => `${e.scope}:${e.id}`).join(',')

  useEffect(() => {
    if (lang === 'he' || entries.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTranslated({})
      return
    }

    const cached = cache.current.get(lang)
    if (cached) {
      setTranslated(cached)
      return
    }

    let cancelled = false
    setIsLoading(true)

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang, entries }),
    })
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error('translate failed')),
      )
      .then(
        (data: {
          translations: Record<string, { name: string; description?: string }>
        }) => {
          if (cancelled) return
          cache.current.set(lang, data.translations)
          setTranslated(data.translations)
        },
      )
      .catch(() => {
        if (!cancelled) setTranslated({})
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, key])

  function name(id: string, fallback: string): string {
    return translated[id]?.name ?? fallback
  }

  function description(id: string, fallback: string | null): string | null {
    return translated[id]?.description ?? fallback
  }

  return { name, description, isLoading, isTranslated: lang !== 'he' }
}
