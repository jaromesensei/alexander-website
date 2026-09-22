import { getSettings } from '@/lib/data/settings'
import { getMenu } from '@/lib/data/menu'
import { getGallery } from '@/lib/data/gallery'
import { Hero } from '@/components/home/Hero'
import { StoryTeaser } from '@/components/home/StoryTeaser'
import { MenuHighlights } from '@/components/home/MenuHighlights'
import { GalleryTeaser } from '@/components/home/GalleryTeaser'

export default async function HomePage() {
  const [settings, categories, gallery] = await Promise.all([
    getSettings(),
    getMenu(),
    getGallery(),
  ])

  return (
    <>
      <Hero settings={settings} />
      <StoryTeaser settings={settings} />
      <MenuHighlights categories={categories} />
      <GalleryTeaser images={gallery} />
    </>
  )
}
