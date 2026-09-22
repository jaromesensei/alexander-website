'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { waLink, WA_MESSAGES } from '@/lib/whatsapp'
import type { RestaurantSettings } from '@/types/db'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function Hero({ settings }: { settings: RestaurantSettings }) {
  const reserveHref =
    waLink(settings.whatsapp, WA_MESSAGES.reservation) ?? `tel:${settings.phone}`

  return (
    <section className="bg-ink text-paper relative min-h-[92svh] overflow-hidden">
      <div className="absolute inset-0">
        {settings.hero_image_url ? (
          <Image
            src={settings.hero_image_url}
            alt={settings.name}
            fill
            priority
            className="object-cover opacity-70"
            sizes="100vw"
          />
        ) : (
          <div className="from-turquoise/25 via-ink to-pink/25 absolute inset-0 bg-gradient-to-br" />
        )}
        <div className="from-ink via-ink/40 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>

      <Container className="relative flex min-h-[92svh] flex-col justify-end pt-32 pb-16 sm:pb-24">
        <motion.div initial="hidden" animate="visible" variants={container}>
          <motion.p variants={item} className="label-caps text-turquoise mb-4 text-xs">
            נהריה · לוקאל דיינר
          </motion.p>
          <motion.h1
            variants={item}
            className="font-wordmark text-[19vw] leading-[0.82] sm:text-[9.5rem] lg:text-[11rem]"
          >
            <span className="sr-only">{settings.name}</span>
            <span aria-hidden="true">Alexander</span>
          </motion.h1>
          {settings.tagline && (
            <motion.p
              variants={item}
              className="mt-6 max-w-lg text-xl font-semibold sm:text-2xl"
            >
              {settings.tagline}
            </motion.p>
          )}
          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href={reserveHref} target="_blank" size="lg">
              הזמנת שולחן
            </ButtonLink>
            <ButtonLink href="/menu" variant="outlineInverse" size="lg">
              לתפריט
            </ButtonLink>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
