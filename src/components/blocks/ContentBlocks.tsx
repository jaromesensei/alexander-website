import Image from 'next/image'
import Link from 'next/link'
import { ImageIcon, Navigation, UtensilsCrossed } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { HOURS_LABELS } from '@/lib/data/fallback'
import { formatPriceRange, formatTime } from '@/lib/format'
import { featureIcon } from '@/lib/blocks/icons'
import { wazeHref } from '@/lib/links'
import { siteText } from '@/lib/siteTexts'
import { cn } from '@/lib/utils'
import { BlockButton } from './BlockButton'
import { BG_CLASSES, MUTED_TEXT, outlineVariant, primaryVariant } from './styles'
import type { BlockContext } from './context'
import type {
  BlockBg,
  CtaBlock,
  FeaturedDishesBlock,
  FeaturesBlock,
  GalleryBlock,
  HeadingBlock,
  ImageBlock,
  ImageTextBlock,
  LocationBlock,
  TextBlock,
} from '@/lib/blocks/types'
import type { MenuItem } from '@/types/db'

/** מציין מקום לבלוק ריק — מוצג רק בעורך, באתר הבלוק פשוט לא מופיע. */
function Placeholder({ label }: { label: string }) {
  return (
    <section className="py-12">
      <Container>
        <div className="border-ink/20 text-ink-soft flex items-center justify-center gap-2 border-2 border-dashed py-12 text-sm font-semibold">
          <ImageIcon className="size-4" aria-hidden="true" />
          {label}
        </div>
      </Container>
    </section>
  )
}

/** על תמונת רקע הטקסט תמיד בהיר (שכבה כהה מעל התמונה), אז מתנהגים כמו רקע שחור. */
function effectiveBg(block: { bg: BlockBg; bgImage?: string | null }): BlockBg {
  return block.bgImage ? 'ink' : block.bg
}

function BlockSection({
  bg,
  image,
  className,
  children,
}: {
  bg: BlockBg
  image?: string | null
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn(BG_CLASSES[bg], 'relative overflow-hidden', className)}>
      {image && (
        <>
          <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
          <div className="bg-ink/60 absolute inset-0" />
        </>
      )}
      <div className="relative w-full">{children}</div>
    </section>
  )
}

export function HeadingBlockView({
  block,
  level,
}: {
  block: HeadingBlock
  level: 1 | 2
}) {
  const H = level === 1 ? 'h1' : 'h2'
  const bg = effectiveBg(block)
  const center = block.align === 'center'
  return (
    <BlockSection
      bg={bg}
      image={block.bgImage}
      className={cn('py-16 sm:py-24', block.bgImage && 'flex min-h-[60svh] items-end')}
    >
      <Container className={cn(center && 'text-center')}>
        <H
          className={cn(
            'max-w-4xl text-5xl leading-[0.95] whitespace-pre-line sm:text-7xl',
            center && 'mx-auto',
          )}
        >
          {block.title}
        </H>
        {block.text && (
          <p
            className={cn(
              'mt-6 max-w-2xl text-lg whitespace-pre-line sm:text-xl',
              MUTED_TEXT[bg],
              center && 'mx-auto',
            )}
          >
            {block.text}
          </p>
        )}
      </Container>
    </BlockSection>
  )
}

export function TextBlockView({ block, ctx }: { block: TextBlock; ctx: BlockContext }) {
  if (!block.text && !block.title)
    return ctx.preview ? <Placeholder label="טקסט ריק" /> : null
  const large = block.size === 'lg'
  const bg = effectiveBg(block)
  const center = block.align === 'center'

  return (
    <BlockSection bg={bg} image={block.bgImage} className="py-20 sm:py-28">
      <Container className={cn(center && 'text-center')}>
        {block.title ? (
          <h2
            className={cn(
              'mb-6 max-w-3xl text-4xl leading-tight whitespace-pre-line sm:text-5xl',
              center && 'mx-auto',
            )}
          >
            {block.title}
          </h2>
        ) : (
          <h2 className="sr-only">{block.text.slice(0, 40)}</h2>
        )}
        {block.text && (
          <p
            className={cn(
              'whitespace-pre-line',
              center && 'mx-auto',
              large
                ? 'max-w-3xl text-3xl leading-snug font-bold sm:text-4xl'
                : cn('max-w-2xl text-lg leading-relaxed', MUTED_TEXT[bg]),
            )}
          >
            {block.text}
          </p>
        )}
        <BlockButton
          link={block.button}
          settings={ctx.settings}
          variant={outlineVariant(bg)}
          className="mt-10"
        />
      </Container>
    </BlockSection>
  )
}

export function CtaBlockView({ block, ctx }: { block: CtaBlock; ctx: BlockContext }) {
  if (!block.title)
    return ctx.preview ? <Placeholder label="קריאה לפעולה בלי כותרת" /> : null
  const bg = effectiveBg(block)
  const center = block.align === 'center'

  // גדול או ממורכז — כותרת וכפתור אחד מתחת לשני
  if (block.size === 'lg' || center) {
    return (
      <BlockSection
        bg={bg}
        image={block.bgImage}
        className={block.size === 'lg' ? 'py-24 sm:py-32' : 'py-14 sm:py-20'}
      >
        <Container className={cn(center && 'text-center')}>
          <h2
            className={cn(
              'max-w-2xl text-4xl leading-tight whitespace-pre-line sm:text-5xl',
              center && 'mx-auto',
            )}
          >
            {block.title}
          </h2>
          {block.text && (
            <p
              className={cn(
                'mt-6 max-w-md text-lg font-medium whitespace-pre-line',
                center && 'mx-auto',
              )}
            >
              {block.text}
            </p>
          )}
          <BlockButton
            link={block.button}
            settings={ctx.settings}
            variant={primaryVariant(bg)}
            size="lg"
            className="mt-8"
          />
        </Container>
      </BlockSection>
    )
  }

  return (
    <BlockSection bg={bg} image={block.bgImage} className="py-14 sm:py-20">
      <Container className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="max-w-2xl text-4xl leading-tight whitespace-pre-line sm:text-5xl">
            {block.title}
          </h2>
          {block.text && (
            <p className="mt-3 max-w-lg text-lg font-medium whitespace-pre-line">
              {block.text}
            </p>
          )}
        </div>
        <BlockButton
          link={block.button}
          settings={ctx.settings}
          variant={primaryVariant(bg)}
          size="lg"
          className="shrink-0"
        />
      </Container>
    </BlockSection>
  )
}

export function ImageTextBlockView({
  block,
  ctx,
}: {
  block: ImageTextBlock
  ctx: BlockContext
}) {
  return (
    <section className={cn(BG_CLASSES[block.bg], 'py-20 sm:py-28')}>
      <Container className="grid items-center gap-8 sm:grid-cols-2 sm:gap-16">
        <div
          className={cn(
            'bg-paper-dark relative aspect-4/5 overflow-hidden',
            block.imageSide === 'end' && 'sm:order-2',
          )}
        >
          {block.image ? (
            <Image
              src={block.image}
              alt={block.imageAlt || block.title}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="text-ink-soft/40 flex h-full items-center justify-center">
              <ImageIcon className="size-12" strokeWidth={1} aria-hidden="true" />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-4xl leading-tight whitespace-pre-line sm:text-5xl">
            {block.title}
          </h2>
          {block.text && (
            <p
              className={cn(
                'mt-5 max-w-md text-lg leading-relaxed whitespace-pre-line',
                MUTED_TEXT[block.bg],
              )}
            >
              {block.text}
            </p>
          )}
          <BlockButton
            link={block.button}
            settings={ctx.settings}
            variant={primaryVariant(block.bg)}
            className="mt-8"
          />
        </div>
      </Container>
    </section>
  )
}

export function ImageBlockView({ block, ctx }: { block: ImageBlock; ctx: BlockContext }) {
  if (!block.image)
    return ctx.preview ? <Placeholder label="תמונה — עוד לא הועלתה" /> : null
  return (
    <section className="py-10 sm:py-16">
      <Container>
        <figure>
          <div className="bg-paper-dark relative aspect-video overflow-hidden">
            <Image
              src={block.image}
              alt={block.alt || block.caption || 'צילום מאלכסנדר דיינר'}
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="text-ink-soft mt-3 text-sm">
              {block.caption}
            </figcaption>
          )}
        </figure>
      </Container>
    </section>
  )
}

export function FeaturesBlockView({
  block,
  ctx,
}: {
  block: FeaturesBlock
  ctx: BlockContext
}) {
  const cols =
    block.items.length >= 4
      ? 'lg:grid-cols-4'
      : block.items.length === 3
        ? 'lg:grid-cols-3'
        : 'lg:grid-cols-2'
  return (
    <section className={cn(BG_CLASSES[block.bg], 'py-20 sm:py-28')}>
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-4xl leading-tight whitespace-pre-line sm:text-5xl">
            {block.title}
          </h2>
          <BlockButton
            link={block.button}
            settings={ctx.settings}
            variant={outlineVariant(block.bg)}
          />
        </div>
        <div className={cn('grid gap-10 sm:grid-cols-2', cols)}>
          {block.items.map((item, i) => {
            const Icon = featureIcon(item.icon)
            return (
              <div
                key={i}
                className={cn(
                  'border-t-2 pt-5',
                  block.bg === 'ink' ? 'border-paper' : 'border-ink',
                )}
              >
                <Icon className="mb-4 size-6" strokeWidth={1.75} aria-hidden="true" />
                <h3 className="text-xl">{item.title}</h3>
                {item.text && (
                  <p className={cn('mt-1', MUTED_TEXT[block.bg])}>{item.text}</p>
                )}
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export function FeaturedDishesBlockView({
  block,
  ctx,
}: {
  block: FeaturedDishesBlock
  ctx: BlockContext
}) {
  const featured = ctx.categories
    .flatMap((c) => c.items.filter((i) => i.is_featured))
    .slice(0, Math.max(1, block.limit))
  if (featured.length === 0) {
    return ctx.preview ? <Placeholder label="אין מנות מסומנות כ'מומלץ' בתפריט" /> : null
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <h2 className="mb-14 text-4xl leading-tight whitespace-pre-line sm:text-5xl">
          {block.title}
        </h2>
        <div className="space-y-20 sm:space-y-28">
          {featured.map((item, i) => (
            <DishRow
              key={item.id}
              item={item}
              reversed={i % 2 === 1}
              linkLabel={siteText(ctx.settings, 'dishes.menuLink')}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

function DishRow({
  item,
  reversed,
  linkLabel,
}: {
  item: MenuItem
  reversed: boolean
  linkLabel: string
}) {
  return (
    <article className="grid items-center gap-8 sm:grid-cols-2 sm:gap-16">
      <div
        className={cn(
          'bg-paper-dark relative aspect-4/5 overflow-hidden',
          reversed && 'sm:order-2',
        )}
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name_he}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 hover:scale-105 motion-reduce:hover:scale-100"
          />
        ) : (
          <div className="text-ink-soft/30 flex h-full items-center justify-center">
            <UtensilsCrossed className="size-16" strokeWidth={1} />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-3xl leading-tight sm:text-4xl">{item.name_he}</h3>
        {item.description_he && (
          <p className="text-ink-soft mt-4 max-w-sm text-lg">{item.description_he}</p>
        )}
        <p className="mt-6 text-2xl font-bold tabular-nums">{formatPriceRange(item)}</p>
        <Link
          href="/menu"
          className="text-pink-dark hover:text-pink-deep mt-4 inline-block font-semibold underline underline-offset-4"
        >
          {linkLabel}
        </Link>
      </div>
    </article>
  )
}

export function GalleryBlockView({
  block,
  ctx,
}: {
  block: GalleryBlock
  ctx: BlockContext
}) {
  const images =
    block.images.length > 0
      ? block.images.map((url) => ({ url, alt: 'צילום מאלכסנדר דיינר' }))
      : ctx.gallery
          .slice(0, 6)
          .map((g) => ({ url: g.image_url, alt: g.caption_he || 'צילום מאלכסנדר דיינר' }))
  if (images.length === 0) {
    return ctx.preview ? <Placeholder label="גלריה — עוד אין תמונות" /> : null
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-4xl leading-tight whitespace-pre-line sm:text-5xl">
            {block.title}
          </h2>
          <BlockButton link={block.button} settings={ctx.settings} variant="outline" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((img, i) => (
            <div key={i} className="bg-paper-dark relative aspect-square overflow-hidden">
              <Image
                src={img.url}
                alt={img.alt}
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

export function LocationBlockView({
  block,
  ctx,
}: {
  block: LocationBlock
  ctx: BlockContext
}) {
  const { settings } = ctx
  const waze = wazeHref(settings)

  return (
    <section className="border-ink border-t-2 py-20 sm:py-28">
      <Container className="grid gap-12 sm:grid-cols-2">
        <div>
          <h2 className="text-4xl leading-tight whitespace-pre-line sm:text-5xl">
            {block.title || settings.address}
          </h2>
          {block.title && <p className="mt-3 text-lg">{settings.address}</p>}
          <a
            href={`tel:${settings.phone}`}
            className="text-ink-soft hover:text-ink mt-3 inline-block text-lg tabular-nums"
            dir="ltr"
          >
            {settings.phone}
          </a>
          <div className="mt-8 flex flex-wrap gap-3">
            <BlockButton
              link={{
                label: siteText(settings, 'location.reserve'),
                href: 'wa:reservation',
              }}
              settings={settings}
            />
            {waze && (
              <BlockButton
                link={{ label: siteText(settings, 'location.waze'), href: 'waze' }}
                settings={settings}
                variant="outline"
              >
                <Navigation className="size-4" aria-hidden="true" />
              </BlockButton>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xl">{siteText(settings, 'location.hoursTitle')}</h3>
          <ul className="divide-ink/10 divide-y text-lg">
            {HOURS_LABELS.map((label, i) => {
              const h = settings.hours[String(i)]
              return (
                <li key={i} className="flex justify-between py-2.5">
                  <span>{label}</span>
                  <span className="text-ink-soft tabular-nums" dir="ltr">
                    {h ? `${formatTime(h.open)}–${formatTime(h.close)}` : 'סגור'}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}
