import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPage, getPublishedPages, RESERVED_SLUGS } from '@/lib/data/pages'
import { getBlockContext } from '@/lib/data/blockContext'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

type Props = { params: Promise<{ slug: string }> }

/** עמודים שפורסמו נבנים מראש; עמוד חדש נבנה בביקור הראשון ונשמר במטמון. */
export async function generateStaticParams() {
  const pages = await getPublishedPages()
  return pages.map((p) => ({ slug: p.slug }))
}

async function load(slug: string) {
  if (RESERVED_SLUGS.has(slug)) return null
  return getPage(slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await load((await params).slug)
  if (!page) return {}
  return { title: page.title, description: page.description ?? undefined }
}

export default async function DynamicPage({ params }: Props) {
  const [page, ctx] = await Promise.all([load((await params).slug), getBlockContext()])
  if (!page) notFound()

  return <BlockRenderer blocks={page.blocks} ctx={ctx} />
}
