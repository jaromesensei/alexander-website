import type { Metadata } from 'next'
import Image from 'next/image'
import { getGallery } from '@/lib/data/gallery'
import { getSettings } from '@/lib/data/settings'
import { siteText } from '@/lib/siteTexts'
import { Section, SectionHeading } from '@/components/ui/Section'
import { PageCTA } from '@/components/ui/PageCTA'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: siteText(settings, 'gallery.title'),
    description: 'תמונות מהמסעדה, מהמטבח ומהמנות של אלכסנדר.',
  }
}

export default async function GalleryPage() {
  const [images, settings] = await Promise.all([getGallery(), getSettings()])
  const t = (key: Parameters<typeof siteText>[1]) => siteText(settings, key)

  return (
    <>
      <Section>
        <SectionHeading
          title={t('gallery.title')}
          description={
            images.length === 0 ? t('gallery.empty') : t('gallery.intro') || undefined
          }
        />
        {images.length > 0 && (
          <div className="columns-2 gap-2 sm:columns-3 [&>*]:mb-2">
            {images.map((img) => (
              <div key={img.id} className="relative break-inside-avoid overflow-hidden">
                <Image
                  src={img.image_url}
                  alt={img.caption_he || 'צילום מאלכסנדר דיינר'}
                  width={600}
                  height={600}
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </Section>
      <PageCTA
        title={t('gallery.ctaTitle')}
        primary={{ href: '/menu', label: t('gallery.ctaPrimary') }}
        secondary={{ href: '/contact', label: t('gallery.ctaSecondary') }}
      />
    </>
  )
}
