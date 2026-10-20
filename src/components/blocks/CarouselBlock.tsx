import { Container } from '@/components/ui/Container'
import { siteText } from '@/lib/siteTexts'
import { cn } from '@/lib/utils'
import { BG_CLASSES } from './styles'
import { SlideCarousel } from './SlideCarousel'
import type { BlockContext } from './context'
import type { CarouselBlock } from '@/lib/blocks/types'

/** בלוק קרוסלה חופשי — שקופיות שנערכות בעורך, לא קשורות לתפריט. */
export function CarouselBlockView({
  block,
  ctx,
}: {
  block: CarouselBlock
  ctx: BlockContext
}) {
  const slides = block.slides ?? []
  if (slides.length === 0) return null

  return (
    <section className={cn(BG_CLASSES[block.bg], 'overflow-hidden py-20 sm:py-28')}>
      {block.title && (
        <Container>
          <h2 className="mb-10 text-4xl leading-tight whitespace-pre-line sm:text-5xl">
            {block.title}
          </h2>
        </Container>
      )}
      <SlideCarousel
        title={block.title}
        slides={slides}
        bg={block.bg}
        settings={ctx.settings}
        texts={{
          prev: siteText(ctx.settings, 'carousel.prev'),
          next: siteText(ctx.settings, 'carousel.next'),
        }}
      />
    </section>
  )
}
