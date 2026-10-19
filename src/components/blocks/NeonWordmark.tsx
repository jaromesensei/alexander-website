'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { prefersNoMotion } from '@/lib/a11yPrefs'

const WORD = 'Alexander'
/** האות שמהבהבת כמו צינור ניאון עייף (ה-E השנייה) */
const FLICKER_INDEX = 7
const ease = [0.22, 1, 0.36, 1] as const

const GLOW_OFF = '0 0 0em rgba(255,47,126,0), 0 0 0em rgba(255,47,126,0)'
const GLOW_ON = '0 0 0.06em rgba(255,255,255,0.9), 0 0 0.22em rgba(255,47,126,0.95)'
const GLOW_DIM = '0 0 0.03em rgba(255,255,255,0.4), 0 0 0.1em rgba(255,47,126,0.45)'

/**
 * כניסת הלוגו: האותיות עולות אחת-אחת עם הטיה קלה שמתיישרת (כמו אותיות שנתלות על
 * שלט), ואז השלט "נדלק" בניאון ורוד ואות אחת מהבהבת — ומתייצב ללבן נקי.
 *
 * נגישות: התנועה (transform) כפופה ל-SiteMotion — כבויה ב"הפחתת תנועה" ובתפריט
 * הנגישות. הניאון (צל/שקיפות) מופעל רק אחרי טעינה ורק אם לא ביקשו לעצור תנועה,
 * ומוגבל להבהוב אחד בזוהר ואחד באות — הרבה מתחת ל-3 הבזקים בשנייה (WCAG 2.3.1).
 */
export function NeonWordmark() {
  const [neon, setNeon] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!reduce && !prefersNoMotion()) setNeon(true)
  }, [])

  return (
    // dir="ltr" חובה: כל אות היא inline-block, ובדף RTL הדפדפן היה מסדר אותן מימין לשמאל
    <motion.span
      aria-hidden="true"
      dir="ltr"
      lang="en"
      className="block whitespace-nowrap"
      animate={
        neon
          ? { textShadow: [GLOW_OFF, GLOW_ON, GLOW_DIM, GLOW_ON, GLOW_ON, GLOW_OFF] }
          : undefined
      }
      transition={{
        delay: 0.9,
        duration: 1.6,
        times: [0, 0.06, 0.14, 0.24, 0.6, 1],
        ease: 'linear',
      }}
    >
      {[...WORD].map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: '110%', rotate: i % 2 === 0 ? -7 : 7 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ delay: 0.06 * i, duration: 0.75, ease }}
        >
          {i === FLICKER_INDEX ? (
            <motion.span
              className="inline-block"
              animate={neon ? { opacity: [1, 0.25, 1, 1] } : undefined}
              transition={{ delay: 1.55, duration: 0.45, times: [0, 0.3, 0.6, 1] }}
            >
              {letter}
            </motion.span>
          ) : (
            letter
          )}
        </motion.span>
      ))}
    </motion.span>
  )
}
