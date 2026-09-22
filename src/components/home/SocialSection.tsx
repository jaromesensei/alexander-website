import Image from 'next/image'
import { Camera } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import type { GalleryImage, RestaurantSettings } from '@/types/db'

export function SocialSection({
  images,
  settings,
}: {
  images: GalleryImage[]
  settings: RestaurantSettings
}) {
  const preview = images.slice(0, 6)

  return (
    <section className="py-20 sm:py-32">
      <Container>
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="label-caps text-pink mb-3 text-xs">התמונות שלנו</p>
            <h2 className="font-display text-4xl leading-[0.95] sm:text-6xl">
              עוקבים אחרינו
            </h2>
          </Reveal>
          {settings.instagram_url && (
            <Reveal delay={0.1}>
              <ButtonLink href={settings.instagram_url} target="_blank" variant="outline">
                FOLLOW THE VIBE
              </ButtonLink>
            </Reveal>
          )}
        </div>

        {preview.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {preview.map((img, i) => (
              <Reveal
                key={img.id}
                delay={i * 0.05}
                className="relative aspect-square overflow-hidden"
              >
                <Image
                  src={img.image_url}
                  alt={img.caption_he ?? ''}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-paper-dark flex aspect-square items-center justify-center"
              >
                <Camera className="text-ink-soft/40 size-6" />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
