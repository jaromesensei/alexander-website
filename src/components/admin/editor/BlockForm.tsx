'use client'

import { BLOCK_DEFS, type Field } from '@/lib/blocks/defs'
import {
  BgField,
  FeaturesField,
  FieldShell,
  ImagesField,
  ImageUploadButton,
  Input,
  LinkField,
  SegmentedField,
  Textarea,
} from './fields'
import type { LinkOption } from '@/lib/blocks/linkOptions'
import type { Block, BlockBg, FeatureItem, LinkValue } from '@/lib/blocks/types'

/** טופס עריכה לבלוק, נבנה אוטומטית מהגדרת השדות ב-BLOCK_DEFS. */
export function BlockForm({
  block,
  linkOptions,
  onChange,
}: {
  block: Block
  linkOptions: LinkOption[]
  onChange: (patch: Partial<Block>) => void
}) {
  const def = BLOCK_DEFS[block.type]
  // הבלוקים הם union — ניגשים לשדות לפי מפתח מההגדרה
  const data = block as unknown as Record<string, unknown>
  const set = (key: string, value: unknown) =>
    onChange({ [key]: value } as Partial<Block>)

  function render(field: Field) {
    const value = data[field.key]
    switch (field.kind) {
      case 'text':
        return (
          <Input
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => set(field.key, e.target.value)}
          />
        )
      case 'textarea':
        return (
          <Textarea
            rows={field.rows ?? 3}
            value={(value as string) ?? ''}
            onChange={(e) => set(field.key, e.target.value)}
          />
        )
      case 'image':
        return (
          <ImageUploadButton
            value={(value as string | null) ?? null}
            onChange={(url) => set(field.key, url)}
            folder="pages"
          />
        )
      case 'images':
        return (
          <ImagesField
            value={(value as string[]) ?? []}
            onChange={(v) => set(field.key, v)}
          />
        )
      case 'bg':
        return <BgField value={value as BlockBg} onChange={(v) => set(field.key, v)} />
      case 'link':
        return (
          <LinkField
            value={(value as LinkValue | null) ?? null}
            options={linkOptions}
            onChange={(v) => set(field.key, v)}
          />
        )
      case 'select':
        return (
          <SegmentedField
            value={value as string}
            options={field.options}
            onChange={(v) => set(field.key, v)}
          />
        )
      case 'number':
        return (
          <Input
            type="number"
            dir="ltr"
            min={field.min}
            max={field.max}
            value={value as number}
            onChange={(e) =>
              set(
                field.key,
                Math.min(
                  field.max,
                  Math.max(field.min, Number(e.target.value) || field.min),
                ),
              )
            }
            className="w-28"
          />
        )
      case 'features':
        return (
          <FeaturesField
            value={(value as FeatureItem[]) ?? []}
            onChange={(v) => set(field.key, v)}
          />
        )
    }
  }

  return (
    <div className="space-y-4">
      {def.fields.map((field) => (
        <FieldShell
          key={field.key}
          label={field.label}
          help={'help' in field ? field.help : undefined}
        >
          {render(field)}
        </FieldShell>
      ))}

      <details className="text-sm">
        <summary className="text-ink-soft cursor-pointer font-semibold">מתקדם</summary>
        <div className="mt-3">
          <FieldShell
            label="מזהה לקישור ישיר"
            help="באנגלית, למשל events. מאפשר לקשר לסקשן הזה מהתפריט (/#events)."
          >
            <Input
              dir="ltr"
              value={block.anchor ?? ''}
              onChange={(e) =>
                onChange({
                  anchor:
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, '')
                      .slice(0, 40) || undefined,
                })
              }
              placeholder="events"
            />
          </FieldShell>
        </div>
      </details>
    </div>
  )
}
