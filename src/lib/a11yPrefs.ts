/** העדפות תפריט הנגישות — נשמרות בדפדפן ומוחלות כמחלקות על <html>. */
export interface A11yPrefs {
  /** 0 = רגיל, 1–3 = הגדלה */
  text: number
  contrast: boolean
  links: boolean
  font: boolean
  noMotion: boolean
}

export const A11Y_STORAGE_KEY = 'alex_a11y'

export const DEFAULT_PREFS: A11yPrefs = {
  text: 0,
  contrast: false,
  links: false,
  font: false,
  noMotion: false,
}

const FLAGS = {
  contrast: 'a11y-contrast',
  links: 'a11y-links',
  font: 'a11y-font',
  noMotion: 'a11y-no-motion',
} as const

export function applyPrefs(p: A11yPrefs) {
  const c = document.documentElement.classList
  for (const n of [1, 2, 3]) c.toggle(`a11y-text-${n}`, p.text === n)
  for (const [key, cls] of Object.entries(FLAGS))
    c.toggle(cls, Boolean(p[key as keyof typeof FLAGS]))
}

/**
 * סקריפט קטן שרץ ב-<head> לפני הציור הראשון, כדי שמי שבחר טקסט גדול או ניגודיות
 * לא יראה "הבזק" של העיצוב הרגיל. ללא קלט חיצוני — מחרוזת קבועה.
 */
export const A11Y_BOOT_SCRIPT = `try{var p=JSON.parse(localStorage.getItem('${A11Y_STORAGE_KEY}')||'{}'),c=document.documentElement.classList;if([1,2,3].indexOf(p.text)>-1)c.add('a11y-text-'+p.text);if(p.contrast)c.add('a11y-contrast');if(p.links)c.add('a11y-links');if(p.font)c.add('a11y-font');if(p.noMotion)c.add('a11y-no-motion')}catch(e){}`

/** האם המשתמש ביקש לעצור אנימציות (בתפריט הנגישות). */
export function prefersNoMotion(): boolean {
  return (
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('a11y-no-motion')
  )
}
