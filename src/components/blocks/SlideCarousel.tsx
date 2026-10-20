'use client'

import Image from 'next/image'
import { Carousel } from '@/components/ui/Carousel'
import { BlockButton } from './BlockButton'
import { LayeredVisual } from './LayeredVisual'
import { MUTED_TEXT, outlineVariant } from './styles'
import { cn } from '@/lib/utils'
import type { BlockBg, CarouselSlide } from '@/lib/blocks/types'
import type { RestaurantSettings } from '@/types/db'

export function SlideCarousel({
  title,
  slides,
  bg,
  settings,
  texts,
}: {
  title: string
  slides: CarouselSlide[]
  bg: BlockBg
  settings: RestaurantSettings
  texts: { prev: string; next: string }
}) {
  return (
    <Carousel
      label={title}
      count={slides.length}
      prevLabel={texts.prev}
      nextLabel={texts.next}
      slideLabel={(i) => slides[i].title || `${i + 1}`}
      renderSlide={(i, active) => (
        <Slide slide={slides[i]} active={active} bg={bg} settings={settings} />
      )}
    />
  )
}

function Slide({
  slide,
  active,
  bg,
  settings,
}: {
  slide: CarouselSlide
  active: boolean
  bg: BlockBg
  settings: RestaurantSettings
}) {
  const layers = (slide.layers ?? []).filter((l) => l.image_url)
  const visualBg = bg === 'ink' ? 'bg-paper/10' : 'bg-ink/5'

  return (
    <>
      {layers.length >= 2 ? (
        <div className={cn('relative aspect-[4/5] overflow-hidden', visualBg)}>
          <LayeredVisual layers={layers} open={active} />
        </div>
      ) : slide.image ? (
        <div className={cn('relative aspect-[4/5] overflow-hidden', visualBg)}>
          <Image
            src={slide.image}
            alt={slide.imageAlt ?? ''}
            fill
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 78vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="text-2xl leading-tight sm:text-3xl">{slide.title}</h3>
        {slide.badge && (
          <p className="shrink-0 text-xl font-bold tabular-nums">{slide.badge}</p>
        )}
      </div>
      {slide.text && (
        <p className={cn('mt-2 whitespace-pre-line', MUTED_TEXT[bg])}>{slide.text}</p>
      )}
      <BlockButton
        link={slide.button}
        settings={settings}
        variant={outlineVariant(bg)}
        size="sm"
        className="mt-5"
      />
    </>
  )
}
