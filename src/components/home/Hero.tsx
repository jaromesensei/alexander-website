'use client'

import Image from 'next/image'
import { motion, MotionConfig } from 'motion/react'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { waLink, WA_MESSAGES } from '@/lib/whatsapp'
import type { RestaurantSettings } from '@/types/db'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero({ settings }: { settings: RestaurantSettings }) {
  const reserveHref =
    waLink(settings.whatsapp, WA_MESSAGES.reservation) ?? `tel:${settings.phone}`

  return (
    <MotionConfig reducedMotion="user">
      <section className="bg-ink text-paper relative overflow-hidden">
        {settings.hero_image_url && (
          <>
            <Image
              src={settings.hero_image_url}
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
              בכל מסך. יחס רוחב/גובה של Bebas ≈ 3.6; 0.27 משאיר מרווח לפס הגלילה ש-100vw כולל */}
          <h1 className="font-wordmark overflow-hidden text-[calc((100vw-2rem)*0.27)] leading-[0.8] sm:text-[calc((100vw-3rem)*0.27)] lg:text-[calc((min(100vw,72rem)-4rem)*0.27)]">
            <span className="sr-only">{settings.name}</span>
            <motion.span
              aria-hidden="true"
              className="block"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease }}
            >
              Alexander
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55, ease }}
            className="border-paper/20 mt-8 flex flex-col gap-8 border-t pt-8 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              {settings.tagline && (
                <p className="max-w-lg text-2xl font-bold text-balance sm:text-3xl">
                  {settings.tagline}
                </p>
              )}
              <p className="text-paper/60 mt-2 text-base">לוקאל דיינר בנהריה</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={reserveHref} target="_blank" size="lg">
                הזמנת שולחן
              </ButtonLink>
              <ButtonLink href="/menu" variant="outlineInverse" size="lg">
                לתפריט
              </ButtonLink>
            </div>
          </motion.div>
        </Container>
      </section>
    </MotionConfig>
  )
}
