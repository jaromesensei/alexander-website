'use client'

import { useState } from 'react'
import { MotionConfig } from 'motion/react'
import { prefersNoMotion } from '@/lib/a11yPrefs'

/**
 * MotionConfig שמכבד גם את "הפחתת תנועה" של מערכת ההפעלה וגם את
 * "עצירת אנימציות" בתפריט הנגישות של האתר.
 */
export function SiteMotion({ children }: { children: React.ReactNode }) {
  const [noMotion] = useState(prefersNoMotion)
  return (
    <MotionConfig reducedMotion={noMotion ? 'always' : 'user'}>{children}</MotionConfig>
  )
}
