import { MENU_TAGS, isMenuTag, normalizeTag } from '@/lib/menu/tags'
import { TAG_ICONS } from './tagIcons'
import { cn } from '@/lib/utils'

type LabelFn = (key: string, fallback: string) => string
const identity: LabelFn = (_key, fallback) => fallback

/** תגיות בולטות (המלצת השף, חדש…) — מוצגות ליד שם המנה. */
export function HighlightTags({
  tags,
  label = identity,
  className,
}: {
  tags: string[]
  label?: LabelFn
  className?: string
}) {
  const keys = tags
    .map(normalizeTag)
    .filter((t) => isMenuTag(t) && MENU_TAGS[t].kind === 'highlight')
  if (keys.length === 0) return null

  return (
    <span className={cn('inline-flex flex-wrap gap-1.5', className)}>
      {keys.map((key) => {
        if (!isMenuTag(key)) return null
        const Icon = TAG_ICONS[key]
        return (
          <span
            key={key}
            className="bg-mustard text-ink inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
          >
            <Icon className="size-3" strokeWidth={2.25} aria-hidden="true" />
            {label(key, MENU_TAGS[key].label)}
          </span>
        )
      })}
    </span>
  )
}

/** מידע תזונתי ואלרגנים — שורה שקטה מתחת לתיאור. */
export function DietTags({
  tags,
  label = identity,
  className,
}: {
  tags: string[]
  label?: LabelFn
  className?: string
}) {
  const keys = tags
    .map(normalizeTag)
    .filter((t) => !isMenuTag(t) || MENU_TAGS[t].kind === 'diet')
  if (keys.length === 0) return null

  return (
    <ul className={cn('text-ink-soft flex flex-wrap gap-x-4 gap-y-1 text-sm', className)}>
      {keys.map((key) => {
        const Icon = isMenuTag(key) ? TAG_ICONS[key] : null
        return (
          <li key={key} className="inline-flex items-center gap-1.5">
            {Icon && <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />}
            {isMenuTag(key) ? label(key, MENU_TAGS[key].label) : key}
          </li>
        )
      })}
    </ul>
  )
}
