import Image from 'next/image'
import { Camera } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeading } from '@/components/ui/Section'
import type { GalleryImage } from '@/types/db'

export function GalleryTeaser({ images }: { images: GalleryImage[] }) {
  const preview = images.slice(0, 6)

  return (
    <Section className="bg-charcoal text-cream">
      <SectionHeading
        eyebrow="אצלנו במסעדה"
        title="הרגעים שאנחנו הכי אוהבים"
        description={
          preview.length === 0
            ? 'הגלריה תתמלא בקרוב — עדכון תמונות מתבצע מהניהול.'
            : undefined
        }
      />
      {preview.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {preview.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={img.image_url}
                alt={img.caption_he ?? ''}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-cream/10 flex aspect-square items-center justify-center rounded-2xl"
            >
              <Camera className="text-cream/30 size-6" />
            </div>
          ))}
        </div>
      )}
      <div className="mt-10 text-center">
        <ButtonLink
          href="/gallery"
          variant="outline"
          className="border-cream text-cream hover:bg-cream hover:text-charcoal"
        >
          לכל הגלריה
        </ButtonLink>
      </div>
    </Section>
  )
}
