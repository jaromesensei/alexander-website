import { getSettings } from '@/lib/data/settings'
import { getMenu } from '@/lib/data/menu'
import { getGallery } from '@/lib/data/gallery'
import { Hero } from '@/components/home/Hero'
import { Promotion } from '@/components/home/Promotion'
import { SignatureDishes } from '@/components/home/SignatureDishes'
import { MenuTeaser } from '@/components/home/MenuTeaser'
import { DinerExperience } from '@/components/home/DinerExperience'
import { CocktailSection } from '@/components/home/CocktailSection'
import { EventsSection } from '@/components/home/EventsSection'
import { SocialSection } from '@/components/home/SocialSection'
import { LocationSection } from '@/components/home/LocationSection'

export default async function HomePage() {
  const [settings, categories, gallery] = await Promise.all([
    getSettings(),
    getMenu(),
    getGallery(),
  ])

  return (
    <>
      <Hero settings={settings} />
      <Promotion settings={settings} />
      <SignatureDishes categories={categories} />
      <MenuTeaser />
      <DinerExperience settings={settings} />
      <CocktailSection />
      <EventsSection settings={settings} />
      <SocialSection images={gallery} settings={settings} />
      <LocationSection settings={settings} />
    </>
  )
}
