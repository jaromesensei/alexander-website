import type { Metadata } from 'next'
import { getBlockContext } from '@/lib/data/blockContext'
import { PreviewFrame } from '@/components/admin/editor/PreviewFrame'

export const metadata: Metadata = {
  title: 'תצוגה מקדימה',
  robots: { index: false, follow: false },
}

/**
 * העמוד שנטען בתוך ה-iframe של העורך. לא מכיל תוכן משלו — רק נתונים
 * ציבוריים (הגדרות/תפריט/גלריה) ומה שהעורך שולח ב-postMessage.
 */
export default async function PreviewPage() {
  const ctx = await getBlockContext()
  return <PreviewFrame ctx={ctx} />
}
