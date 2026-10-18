import { getSettings } from './settings'
import { getMenu } from './menu'
import { getGallery } from './gallery'
import type { BlockContext } from '@/components/blocks/context'

export async function getBlockContext(): Promise<BlockContext> {
  const [settings, categories, gallery] = await Promise.all([
    getSettings(),
    getMenu(),
    getGallery(),
  ])
  return { settings, categories, gallery }
}
