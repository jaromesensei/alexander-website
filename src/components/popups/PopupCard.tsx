import Image from 'next/image'
import { X } from 'lucide-react'
import { BlockButton } from '@/components/blocks/BlockButton'
import { BG_CLASSES, MUTED_TEXT, primaryVariant } from '@/components/blocks/styles'
import { cn } from '@/lib/utils'
import type { Popup, RestaurantSettings } from '@/types/db'

export type PopupContent = Pick<Popup, 'heading' | 'body' | 'image_url' | 'button' | 'bg'>

/** תוכן החלון הקופץ — משותף לאתר ולתצוגה המקדימה בניהול. */
export function PopupCard({
  popup,
  settings,
  onClose,
  titleId,
}: {
  popup: PopupContent
  settings: RestaurantSettings
  onClose?: () => void
  titleId?: string
}) {
  return (
    <div
      className={cn(
        'relative w-full max-w-md overflow-hidden shadow-2xl',
        BG_CLASSES[popup.bg],
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="סגירה"
        className="bg-paper/90 text-ink hover:bg-paper absolute end-3 top-3 z-10 flex size-9 items-center justify-center rounded-full"
      >
        <X className="size-5" />
      </button>
      {popup.image_url && (
        <div className="bg-paper-dark relative aspect-[4/3]">
          <Image
            src={popup.image_url}
            alt=""
            fill
            sizes="(min-width: 480px) 448px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6 sm:p-8">
        <h2
          id={titleId}
          className={cn(
            'text-3xl leading-tight whitespace-pre-line sm:text-4xl',
            !popup.image_url && 'pe-10',
          )}
        >
          {popup.heading}
        </h2>
        {popup.body && (
          <p className={cn('mt-3 text-lg whitespace-pre-line', MUTED_TEXT[popup.bg])}>
            {popup.body}
          </p>
        )}
        <BlockButton
          link={popup.button}
          settings={settings}
          variant={primaryVariant(popup.bg)}
          size="lg"
          className="mt-6 w-full"
          onClick={onClose}
        />
      </div>
    </div>
  )
}
