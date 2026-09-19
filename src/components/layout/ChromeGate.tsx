'use client'

import { usePathname } from 'next/navigation'

/** מסתיר Header/Footer הציבוריים במסלולי /admin, שיש להם ניווט משלהם. */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <>{children}</>
}
