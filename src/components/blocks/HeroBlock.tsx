import Image from 'next/image'
import { BlockButton } from './BlockButton'
import { NeonWordmark } from './NeonWordmark'
import type { HeroBlock as HeroBlockData } from '@/lib/blocks/types'
import type { RestaurantSettings } from '@/types/db'

export function HeroBlock({
  block,
  settings,
}: {
  block: HeroBlockData
  settings: RestaurantSettings
}) {
  // טלוויזיה וינטג': מסגרת עץ אגוז (tv-frame) צמודה לקצוות, פינות מעוגלות רק בפנים, שוליים כהים (tv-bezel) וזכוכית עם
  // פסים אפורים (tv-glass) — הכול ב-CSS (globals.css), כך שהמסגרת נכנסת בדיוק בכל מסך.
  // הגובה = המסך פחות הכותרת (4.5rem) ובטלפון גם פחות הסרגל התחתון (~4rem).
  return (
    <section className="bg-ink text-paper flex min-h-[calc(100svh-8.5rem)] md:min-h-[calc(100svh-4.5rem)]">
      <div className="tv-frame flex flex-1 p-3 sm:p-5 lg:p-7">
        <div className="tv-bezel flex flex-1 rounded-[1.1rem] p-1.5 sm:rounded-[2rem] sm:p-2">
          <div className="tv-screen relative flex flex-1 overflow-hidden rounded-[0.9rem] sm:rounded-[1.75rem/2.25rem]">
            <div aria-hidden="true" className="tv-glass absolute inset-0">
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
              <div className="tv-scanlines absolute inset-0" />
            </div>

            {/* @container: גודל ה-wordmark נגזר מרוחב המסך של הטלוויזיה (cqi), כך שהוא
                ממלא אותו בכל מסך. יחס רוחב/גובה של Bebas ≈ 3.6, ותקרה לרוחב 72rem.
                הריפוד + המרווח השלילי נותנים מקום לזוהר הניאון בלי להזיז את הלוגו */}
            <div className="@container relative flex flex-1 flex-col justify-end px-5 pt-20 pb-8 sm:px-10 sm:pb-12 lg:px-14">
              <h1 className="font-wordmark -m-[0.12em] overflow-hidden p-[0.12em] text-[min(27cqi,18rem)] leading-[0.8]">
                <span className="sr-only">{settings.name}</span>
                <NeonWordmark />
              </h1>

              {/* הקו נמתח מימין לשמאל, בכיוון הקריאה (אנימציות hero-* ב-globals.css) */}
              <div
                aria-hidden="true"
                className="hero-rule bg-paper/20 mt-8 h-px origin-right"
              />

              <div className="hero-content flex flex-col gap-8 pt-8 sm:flex-row sm:items-end sm:justify-between">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
