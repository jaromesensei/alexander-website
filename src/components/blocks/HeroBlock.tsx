'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { SiteMotion } from '@/components/a11y/SiteMotion'
import { Container } from '@/components/ui/Container'
import { BlockButton } from './BlockButton'
import { NeonWordmark } from './NeonWordmark'
import type { HeroBlock as HeroBlockData } from '@/lib/blocks/types'
import type { RestaurantSettings } from '@/types/db'

const ease = [0.22, 1, 0.36, 1] as const

export function HeroBlock({
  block,
  settings,
}: {
  block: HeroBlockData
  settings: RestaurantSettings
}) {
  return (
    <SiteMotion>
      <section className="bg-ink text-paper relative overflow-hidden">
        {block.image && (
          <>
            <Image
              src={block.image}
              alt=""
              fill
              priority
              className="object-cover opacity-60"
              sizes="100vw"
            />
            <div className="from-ink absolute inset-0 bg-gradient-to-t to-transparent" />
          </>
        )}

        <Container className="relative flex min-h-[88svh] flex-col justify-end pt-28 pb-12 sm:pb-16">
          {/* גודל נגזר מרוחב התוכן של Container (max-w-6xl + ריפוד) כך שה-wordmark ממלא אותו
              בכל מסך. יחס רוחב/גובה של Bebas ≈ 3.6; 0.27 משאיר מרווח לפס הגלילה ש-100vw כולל.
              הריפוד + המרווח השלילי נותנים מקום לזוהר הניאון בלי להזיז את הלוגו */}
          <h1 className="font-wordmark -m-[0.12em] overflow-hidden p-[0.12em] text-[calc((100vw-2rem)*0.27)] leading-[0.8] sm:text-[calc((100vw-3rem)*0.27)] lg:text-[calc((min(100vw,72rem)-4rem)*0.27)]">
            <span className="sr-only">{settings.name}</span>
            <NeonWordmark />
          </h1>

          {/* הקו נמתח מימין לשמאל, בכיוון הקריאה */}
          <motion.div
            aria-hidden="true"
            className="bg-paper/20 mt-8 h-px origin-right"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.9, ease }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.95, ease }}
            className="flex flex-col gap-8 pt-8 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              {block.tagline && (
                <p className="max-w-lg text-2xl font-bold text-balance whitespace-pre-line sm:text-3xl">
                  {block.tagline}
                </p>
              )}
              {block.subtitle && (
                <p className="text-paper/60 mt-2 text-base">{block.subtitle}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <BlockButton link={block.primary} settings={settings} size="lg" />
              <BlockButton
                link={block.secondary}
                settings={settings}
                variant="outlineInverse"
                size="lg"
              />
            </div>
          </motion.div>
        </Container>
      </section>
    </SiteMotion>
  )
}
