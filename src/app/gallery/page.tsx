import type { Metadata } from 'next'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { getGallery } from '@/lib/data/gallery'
import { Section, SectionHeading } from '@/components/ui/Section'

export const metadata: Metadata = {
  title: 'גלריה',
  description: 'תמונות מהמסעדה, מהמטבח ומהמנות של אלכסנדר.',
}

export default async function GalleryPage() {
  const images = await getGallery()

  return (
    <Section>
      <SectionHeading eyebrow="אצלנו במסעדה" title="גלריה" />
      {images.length === 0 ? (
        <div className="border-charcoal/20 text-charcoal-soft flex flex-col items-center gap-3 rounded-2xl border border-dashed py-20 text-center">
          <Camera className="size-8" />
          <p>הגלריה תתמלא בקרוב — עדכון תמונות מתבצע מהניהול.</p>
        </div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative break-inside-avoid overflow-hidden rounded-2xl"
            >
              <Image
                src={img.image_url}
                alt={img.caption_he ?? ''}
                width={600}
                height={600}
                className="w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
