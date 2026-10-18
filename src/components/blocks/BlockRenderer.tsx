import { AnchoredBlock } from './BlockView'
import type { BlockContext } from './context'
import type { Block } from '@/lib/blocks/types'

export function BlockRenderer({ blocks, ctx }: { blocks: Block[]; ctx: BlockContext }) {
  return (
    <>
      {blocks
        .filter((b) => !b.hidden)
        .map((block, i) => (
          <AnchoredBlock key={block.id} block={block} ctx={ctx} index={i} />
        ))}
    </>
  )
}
