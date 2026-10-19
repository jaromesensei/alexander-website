'use client'

import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { dirForLang } from '@/lib/i18n/languages'

/**
 * כותרת עמוד התפריט והערת האלרגנים — מתורגמות יחד עם התפריט. המקור נשלף בשרת
 * מההגדרות לפי המפתח (לא נשלח מכאן), כמו שאר הטקסטים המתורגמים.
 */
export function MenuHeading({ title, intro }: { title: string; intro: string }) {
  const { lang } = useLanguage()
  const t = useTranslations([
    { id: 'menu.title', scope: 'site_text' },
    ...(intro ? [{ id: 'menu.intro', scope: 'site_text' as const }] : []),
  ])
  const dir = dirForLang(lang)

  return (
    <div lang={lang} dir={dir}>
      <h1 className="text-4xl leading-tight sm:text-5xl">
        {t.name('menu.title', title)}
      </h1>
      {intro && (
        <p className="text-ink-soft mt-4 max-w-2xl text-lg whitespace-pre-line">
          {t.name('menu.intro', intro)}
        </p>
      )}
    </div>
  )
}
