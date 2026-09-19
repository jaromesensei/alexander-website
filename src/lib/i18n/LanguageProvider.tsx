'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DEFAULT_LANG, LANG_COOKIE, dirForLang } from './languages'

interface LanguageContextValue {
  lang: string
  setLang: (lang: string) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState(DEFAULT_LANG)

  useEffect(() => {
    // חייב לרוץ אחרי ה-hydration הראשון (לא בזמן ה-render) כדי שהעברית
    // תואמת תמיד את ה-HTML שהשרת שלח, ורק אז מתעדכן לשפה השמורה בעוגייה.
    const saved = readCookie(LANG_COOKIE)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setLangState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dirForLang(lang)
  }, [lang])

  function setLang(next: string) {
    setLangState(next)
    document.cookie = `${LANG_COOKIE}=${encodeURIComponent(next)}; path=/; max-age=31536000`
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
