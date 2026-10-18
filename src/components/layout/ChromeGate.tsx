'use client'

import { usePathname } from 'next/navigation'
import { PREVIEW_PATH } from '@/lib/blocks/previewProtocol'

/** מסתיר Header/Footer הציבוריים במסלולי /admin (חוץ מהתצוגה המקדימה של העורך). */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin') && pathname !== PREVIEW_PATH) return null
  return <>{children}</>
}
