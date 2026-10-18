import { HeroBlock } from './HeroBlock'
import {
  CtaBlockView,
  FeaturedDishesBlockView,
  FeaturesBlockView,
  GalleryBlockView,
  HeadingBlockView,
  ImageBlockView,
  ImageTextBlockView,
  LocationBlockView,
  TextBlockView,
} from './ContentBlocks'
import type { BlockContext } from './context'
import type { Block } from '@/lib/blocks/types'

/** בלוק בודד. index קובע אם כותרת עמוד היא h1 (הבלוק הראשון) או h2. */
export function BlockView({
  block,
  ctx,
  index,
}: {
  block: Block
  ctx: BlockContext
  index: number
}) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block} settings={ctx.settings} />
    case 'heading':
      return <HeadingBlockView block={block} level={index === 0 ? 1 : 2} />
    case 'text':
      return <TextBlockView block={block} ctx={ctx} />
    case 'cta':
      return <CtaBlockView block={block} ctx={ctx} />
    case 'image_text':
      return <ImageTextBlockView block={block} ctx={ctx} />
    case 'image':
      return <ImageBlockView block={block} ctx={ctx} />
    case 'features':
      return <FeaturesBlockView block={block} ctx={ctx} />
    case 'featured_dishes':
      return <FeaturedDishesBlockView block={block} ctx={ctx} />
    case 'gallery':
      return <GalleryBlockView block={block} ctx={ctx} />
    case 'location':
      return <LocationBlockView block={block} ctx={ctx} />
    default:
      return null
  }
}

/** עוטף בלוק עם עוגן (/#anchor) אם הוגדר לו. */
export function AnchoredBlock({
  block,
  ctx,
  index,
}: {
  block: Block
  ctx: BlockContext
  index: number
}) {
  const view = <BlockView block={block} ctx={ctx} index={index} />
  return block.anchor ? (
    <div id={block.anchor} className="scroll-mt-20">
      {view}
    </div>
  ) : (
    view
  )
}
