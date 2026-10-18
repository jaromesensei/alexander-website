/**
 * תגיות מנה מוגדרות מראש. במסד נשמר המפתח (למשל 'vegan'), כך שהתצוגה,
 * האייקון והתרגום אחידים בכל התפריט. תגית שאינה ברשימה (טקסט חופשי
 * מגרסאות קודמות) מוצגת כמו שהיא.
 *
 * highlight — תגית בולטת ליד שם המנה. diet — מידע תזונתי/אלרגנים, שקט יותר,
 * ומשמש גם לסינון בעמוד התפריט.
 */
export const MENU_TAGS = {
  chef: { label: 'המלצת השף', kind: 'highlight' },
  popular: { label: 'הכי מוזמן', kind: 'highlight' },
  new: { label: 'חדש', kind: 'highlight' },
  vegan: { label: 'טבעוני', kind: 'diet' },
  vegetarian: { label: 'צמחוני', kind: 'diet' },
  gluten_free: { label: 'ללא גלוטן', kind: 'diet' },
  spicy: { label: 'חריף', kind: 'diet' },
  nuts: { label: 'מכיל אגוזים', kind: 'diet' },
  dairy: { label: 'חלבי', kind: 'diet' },
  kids: { label: 'לילדים', kind: 'diet' },
} as const satisfies Record<string, { label: string; kind: 'highlight' | 'diet' }>

export type MenuTagKey = keyof typeof MENU_TAGS

export function isMenuTag(key: string): key is MenuTagKey {
  return Object.hasOwn(MENU_TAGS, key)
}

/** ממיר גם תגיות ישנות בעברית ('צמחוני') למפתח המתאים. */
export function normalizeTag(tag: string): string {
  if (isMenuTag(tag)) return tag
  const match = (Object.keys(MENU_TAGS) as MenuTagKey[]).find(
    (k) => MENU_TAGS[k].label === tag.trim(),
  )
  return match ?? tag.trim()
}

export const TAG_KEYS = Object.keys(MENU_TAGS) as MenuTagKey[]
