import { getPage, HOME_SLUG } from '@/lib/data/pages'
import { getBlockContext } from '@/lib/data/blockContext'
import { defaultHomeBlocks } from '@/lib/blocks/defaults'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

export default async function HomePage() {
  const [page, ctx] = await Promise.all([getPage(HOME_SLUG), getBlockContext()])
  const blocks = page?.blocks ?? defaultHomeBlocks(ctx.settings)

  return <BlockRenderer blocks={blocks} ctx={ctx} />
}
