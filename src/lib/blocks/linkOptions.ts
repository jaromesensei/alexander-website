import { LINK_ACTIONS } from '@/lib/links'
import { BLOCK_DEFS, blockSummary } from './defs'
import type { Block } from './types'

export interface LinkOption {
  value: string
  label: string
  group: string
}

/** היעדים שמוצעים בבוחר הקישורים: עמודים, סקשנים בעמוד הבית ופעולות. */
export function buildLinkOptions(
  pages: { slug: string; title: string; is_published: boolean }[],
  homeBlocks: Block[],
): LinkOption[] {
  const site: LinkOption[] = [
    { value: '/', label: 'עמוד הבית', group: 'עמודים' },
    { value: '/menu', label: 'תפריט', group: 'עמודים' },
    { value: '/gallery', label: 'גלריה', group: 'עמודים' },
    { value: '/contact', label: 'מיקום ויצירת קשר', group: 'עמודים' },
    ...pages.map((p) => ({
      value: `/${p.slug}`,
      label: p.is_published ? p.title : `${p.title} (טיוטה)`,
      group: 'עמודים',
    })),
  ]

  const sections: LinkOption[] = homeBlocks
    .filter((b) => b.anchor)
    .map((b) => ({
      value: `/#${b.anchor}`,
      label: `${BLOCK_DEFS[b.type].label}: ${blockSummary(b).slice(0, 30) || b.anchor}`,
      group: 'סקשן בעמוד הבית',
    }))

  const actions: LinkOption[] = Object.entries(LINK_ACTIONS).map(([value, label]) => ({
    value,
    label,
    group: 'פעולות',
  }))

  return [...site, ...sections, ...actions]
}
