import { unstable_cache } from 'next/cache'

/** תג אחד לכל התוכן הציבורי — כל שמירה בניהול מרעננת את כולו (ראו admin/actions.ts). */
export const CONTENT_TAG = 'content'

/**
 * עוטף פונקציית קריאה במטמון של Next. שגיאה בתוך fn לא נשמרת במטמון,
 * כך שתקלה זמנית ב-Supabase לא "נתקעת" — הקריאה הבאה תנסה שוב.
 */
export function cached<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  key: string,
) {
  return unstable_cache(fn, [key], { tags: [CONTENT_TAG], revalidate: 3600 })
}
