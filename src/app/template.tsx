'use client'

import { motion } from 'motion/react'

/** template.tsx נטען מחדש בכל ניווט (בניגוד ל-layout.tsx), ולכן ה-fade רץ בכל מעבר עמוד. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
