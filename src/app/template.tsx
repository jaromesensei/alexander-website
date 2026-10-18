'use client'

import { motion } from 'motion/react'
import { SiteMotion } from '@/components/a11y/SiteMotion'

/** template.tsx נטען מחדש בכל ניווט (בניגוד ל-layout.tsx), ולכן ה-fade רץ בכל מעבר עמוד. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <SiteMotion>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </SiteMotion>
  )
}
