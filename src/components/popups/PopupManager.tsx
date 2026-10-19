'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { isPopupLive, placementMatches, zonedNow } from '@/lib/popups/schedule'
import { alreadySeen, markSeen } from '@/lib/popups/seen'
import type { Popup, RestaurantSettings } from '@/types/db'

const loadDialog = () => import('./PopupDialog')
const PopupDialog = dynamic(loadDialog, { ssr: false })

/**
 * בוחר את החלון הקופץ שמתאים לרגע הזה (לפי שעון ישראל) ומציג אותו אחרי
 * ההשהיה שהוגדרה. ההחלטה בדפדפן — כך הדפים נשארים סטטיים ומהירים, והתזמון
 * מדויק לרגע הכניסה ולא לרגע שבו הדף נבנה.
 * הקוד של החלון עצמו (כולל motion) נטען רק כשנמצא חלון להציג.
 */
export function PopupManager({
  popups,
  settings,
}: {
  popups: Popup[]
  settings: RestaurantSettings
}) {
  const pathname = usePathname() ?? '/'
  const [current, setCurrent] = useState<Popup | null>(null)
  // נשאר true אחרי הסגירה, כדי שאנימציית היציאה תספיק לרוץ
  const [mounted, setMounted] = useState(false)
  const close = useCallback(() => setCurrent(null), [])

  useEffect(() => {
    if (pathname.startsWith('/admin') || popups.length === 0) return
    const now = zonedNow()
    const candidate = popups
      .filter(
        (p) =>
          placementMatches(p.placement, pathname) &&
          isPopupLive(p, now) &&
          !alreadySeen(p, now),
      )
      .sort((a, b) => a.sort_order - b.sort_order)[0]
    if (!candidate) return

    // מתחילים להוריד את קוד החלון כבר עכשיו, כדי שיהיה מוכן כשההשהיה נגמרת
    void loadDialog()
    const timer = window.setTimeout(() => {
      markSeen(candidate, now)
      setMounted(true)
      setCurrent(candidate)
    }, candidate.delay_seconds * 1000)
    return () => window.clearTimeout(timer)
  }, [pathname, popups])

  if (!mounted) return null
  return <PopupDialog popup={current} settings={settings} onClose={close} />
}
