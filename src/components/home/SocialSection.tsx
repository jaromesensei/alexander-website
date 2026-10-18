import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import type { GalleryImage, RestaurantSettings } from '@/types/db'

export function SocialSection({
  images,
  settings,
}: {
  images: GalleryImage[]
  settings: RestaurantSettings
}) {
  const preview = images.slice(0, 6)
  if (preview.length === 0) return null

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-4xl leading-tight sm:text-5xl">אצלנו בדיינר</h2>
          {settings.instagram_url ? (
            <ButtonLink href={settings.instagram_url} target="_blank" variant="outline">
              עקבו באינסטגרם
            </ButtonLink>
          ) : (
            <ButtonLink href="/gallery" variant="outline">
              לכל התמונות
            </ButtonLink>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {preview.map((img) => (
            <div key={img.id} className="relative aspect-square overflow-hidden">
              <Image
                src={img.image_url}
                alt={img.caption_he ?? ''}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
