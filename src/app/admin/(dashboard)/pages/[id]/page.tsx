import { notFound } from 'next/navigation'
import { getAdminPagesData } from '@/lib/data/adminPages'
import { HOME_SLUG } from '@/lib/data/pages'
import { PageEditor, type EditorPage } from '@/components/admin/editor/PageEditor'

export default async function AdminPageEditor({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { home, pages, homeBlocks, linkOptions } = await getAdminPagesData()
  const isHome = id === HOME_SLUG

  let initial: EditorPage
  if (isHome) {
    initial = {
      id: home?.id ?? null,
      slug: HOME_SLUG,
      title: 'עמוד הבית',
      description: home?.description ?? '',
      is_published: true,
      blocks: homeBlocks,
    }
  } else {
    const page = pages.find((p) => p.id === id)
    if (!page) notFound()
    initial = {
      id: page.id,
      slug: page.slug,
      title: page.title,
      description: page.description ?? '',
      is_published: page.is_published,
      blocks: page.blocks,
    }
  }

  return (
    <PageEditor
      key={id}
      initial={initial}
      isHome={isHome}
      linkOptions={linkOptions}
      takenSlugs={pages.filter((p) => p.id !== id).map((p) => p.slug)}
    />
  )
}
