import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

interface RequestEntry {
  id: string
  scope: 'menu_item' | 'menu_category'
}

interface SourceRow {
  id: string
  scope: RequestEntry['scope']
  name: string
  description: string | null
}

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const MAX_ENTRIES = 200

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const lang: string | undefined = body?.lang
  const entries: RequestEntry[] | undefined = body?.entries

  if (!lang || typeof lang !== 'string' || lang.length > 10) {
    return NextResponse.json({ error: 'שפה לא תקינה' }, { status: 400 })
  }
  if (!Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json({ translations: {} })
  }
  if (entries.length > MAX_ENTRIES) {
    return NextResponse.json({ error: 'יותר מדי פריטים' }, { status: 400 })
  }

  let supabase: ReturnType<typeof createServiceClient>
  try {
    supabase = createServiceClient()
  } catch (err) {
    console.error('supabase not configured for translation', err)
    return NextResponse.json({ translations: {} })
  }

  const itemIds = entries.filter((e) => e.scope === 'menu_item').map((e) => e.id)
  const categoryIds = entries.filter((e) => e.scope === 'menu_category').map((e) => e.id)

  const sourceRows: SourceRow[] = []

  if (itemIds.length > 0) {
    const { data } = await supabase
      .from('menu_items')
      .select('id, name_he, description_he')
      .in('id', itemIds)
      .eq('is_available', true)
    for (const row of data ?? []) {
      sourceRows.push({
        id: row.id,
        scope: 'menu_item',
        name: row.name_he,
        description: row.description_he,
      })
    }
  }

  if (categoryIds.length > 0) {
    const { data } = await supabase
      .from('menu_categories')
      .select('id, name_he')
      .in('id', categoryIds)
      .eq('is_active', true)
    for (const row of data ?? []) {
      sourceRows.push({
        id: row.id,
        scope: 'menu_category',
        name: row.name_he,
        description: null,
      })
    }
  }

  if (sourceRows.length === 0) {
    return NextResponse.json({ translations: {} })
  }

  // כל טקסט מקבל hash משלו כדי שנוכל למטמן שם/תיאור בנפרד ולשתף מטמון בין מנות זהות.
  type TextRef = {
    hash: string
    text: string
    rowId: string
    field: 'name' | 'description'
  }
  const textRefs: TextRef[] = []
  for (const row of sourceRows) {
    textRefs.push({
      hash: await sha256(`${lang}:${row.name}`),
      text: row.name,
      rowId: row.id,
      field: 'name',
    })
    if (row.description) {
      textRefs.push({
        hash: await sha256(`${lang}:${row.description}`),
        text: row.description,
        rowId: row.id,
        field: 'description',
      })
    }
  }

  const allHashes = textRefs.map((r) => r.hash)
  const { data: cachedRows } = await supabase
    .from('translation_cache')
    .select('source_hash, translated_text')
    .eq('lang', lang)
    .in('source_hash', allHashes)

  const cacheMap = new Map<string, string>()
  for (const row of cachedRows ?? []) cacheMap.set(row.source_hash, row.translated_text)

  const missing = textRefs.filter((r) => !cacheMap.has(r.hash))

  if (missing.length > 0) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (apiKey) {
      try {
        const anthropic = new Anthropic({ apiKey })
        // תרגום מרוכז בקריאה אחת: JSON פנימה, JSON החוצה.
        const payload = missing.map((m, i) => ({ i, text: m.text }))
        const message = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          system:
            'אתה מתרגם תפריטי מסעדות. תרגם כל טקסט לשפה שקוד ISO שלה ניתן. ' +
            'שמור על טון תיאבון וקצר, בלי תוספות או הערות. החזר אך ורק JSON תקין: ' +
            'מערך אובייקטים בצורה [{"i": number, "t": "התרגום"}], באותו סדר ומספר איברים כמו הקלט.',
          messages: [
            {
              role: 'user',
              content: `שפת יעד (קוד ISO): ${lang}\n\nטקסטים לתרגום:\n${JSON.stringify(payload)}`,
            },
          ],
        })

        const textBlock = message.content.find((b) => b.type === 'text')
        const raw = textBlock && 'text' in textBlock ? textBlock.text : '[]'
        const jsonMatch = raw.match(/\[[\s\S]*\]/)
        const parsed: { i: number; t: string }[] = jsonMatch
          ? JSON.parse(jsonMatch[0])
          : []

        const upserts = []
        for (const { i, t } of parsed) {
          const ref = missing[i]
          if (!ref || typeof t !== 'string') continue
          cacheMap.set(ref.hash, t)
          upserts.push({
            lang,
            source_hash: ref.hash,
            source_text: ref.text,
            translated_text: t,
          })
        }
        if (upserts.length > 0) {
          await supabase
            .from('translation_cache')
            .upsert(upserts, { onConflict: 'lang,source_hash' })
        }
      } catch (err) {
        console.error('translation failed', err)
      }
    }
  }

  const translations: Record<string, { name: string; description?: string }> = {}
  for (const row of sourceRows) {
    const nameRef = textRefs.find((r) => r.rowId === row.id && r.field === 'name')!
    const name = cacheMap.get(nameRef.hash) ?? row.name
    const descRef = textRefs.find((r) => r.rowId === row.id && r.field === 'description')
    const description = descRef
      ? (cacheMap.get(descRef.hash) ?? row.description ?? undefined)
      : undefined
    translations[row.id] = { name, description }
  }

  return NextResponse.json({ translations })
}
