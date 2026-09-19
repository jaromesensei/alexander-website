export interface Language {
  code: string
  label: string
  dir: 'rtl' | 'ltr'
}

/** שפות עם כפתור מהיר בתפריט. "שפה אחרת" בוחר קוד חופשי ומתרגם על-הדרך. */
export const QUICK_LANGUAGES: Language[] = [
  { code: 'he', label: 'עברית', dir: 'rtl' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'ru', label: 'Русский', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
]

const RTL_CODES = new Set(['he', 'ar', 'fa', 'ur'])

export function dirForLang(code: string): 'rtl' | 'ltr' {
  return RTL_CODES.has(code) ? 'rtl' : 'ltr'
}

export function labelForLang(code: string): string {
  return QUICK_LANGUAGES.find((l) => l.code === code)?.label ?? code.toUpperCase()
}

export const DEFAULT_LANG = 'he'
export const LANG_COOKIE = 'alex_lang'
