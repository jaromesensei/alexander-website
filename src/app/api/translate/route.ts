import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { MENU_TAGS, isMenuTag } from '@/lib/menu/tags'
import { fetchSettings } from '@/lib/data/settings'
import { siteText, type SiteTextKey } from '@/lib/siteTexts'

export const runtime = 'nodejs'
// תפריט מלא בשפה חדשה = כמה קריאות ל-Claude במקביל; ברירת המחדל קצרה מדי
export const maxDuration = 60

interface RequestEntry {
  id: string
  scope: 'menu_item' | 'menu_category' | 'menu_tag' | 'site_text'
}

interface SourceRow {
  id: string
  scope: RequestEntry['scope']
  name: string
  description: string | null
  /** שמות הגדלים/התוספות של המנה, באותו סדר כמו price_variants (ריק = בלי שם) */
  variants?: string[]
}

/** טקסטים קבועים שמותר לתרגם — רק בעמוד התפריט, והמקור נשלף מההגדרות ב-DB */
const TRANSLATABLE_SITE_TEXTS: SiteTextKey[] = ['menu.title', 'menu.intro', 'menu.empty']

/** כמה טקסטים בכל קריאה ל-Claude: מספיק קטן כדי שהתשובה לא תיחתך באמצע */
const BATCH_SIZE = 40
const PARALLEL_BATCHES = 3

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
      .select('id, name_he, description_he, price_variants')
      .in('id', itemIds)
      .eq('is_available', true)
    for (const row of data ?? []) {
      const variants = ((row.price_variants ?? []) as { label?: string }[]).map((v) =>
        (v.label ?? '').trim(),
      )
      sourceRows.push({
        id: row.id,
        scope: 'menu_item',
        name: row.name_he,
        description: row.description_he,
        variants: variants.some(Boolean) ? variants : undefined,
      })
    }
  }

  if (categoryIds.length > 0) {
    const { data } = await supabase
      .from('menu_categories')
      .select('id, name_he, description_he')
      .in('id', categoryIds)
      .eq('is_active', true)
    for (const row of data ?? []) {
      sourceRows.push({
        id: row.id,
        scope: 'menu_category',
        name: row.name_he,
        description: row.description_he ?? null,
      })
    }
  }

  // תגיות: הטקסט מגיע מרשימה קבועה בקוד (לא מהקליינט), כמו שאר המקורות.
  for (const e of entries) {
    if (e.scope === 'menu_tag' && isMenuTag(e.id)) {
      sourceRows.push({
        id: e.id,
        scope: 'menu_tag',
        name: MENU_TAGS[e.id].label,
        description: null,
      })
    }
  }

  const siteKeys = entries
    .filter((e) => e.scope === 'site_text')
    .map((e) => e.id as SiteTextKey)
    .filter((k) => TRANSLATABLE_SITE_TEXTS.includes(k))
  if (siteKeys.length > 0) {
    const settings = await fetchSettings(supabase).catch(() => null)
    if (settings) {
      for (const key of siteKeys) {
        const text = siteText(settings, key)
        if (text)
          sourceRows.push({ id: key, scope: 'site_text', name: text, description: null })
      }
    }
  }

  if (sourceRows.length === 0) {
    return NextResponse.json({ translations: {} })
  }

  // כל טקסט מקבל hash משלו כדי שנוכל למטמן שם/תיאור בנפרד ולשתף מטמון בין מנות זהות.
  // field: 'name' | 'description' | 'variant:<index>'
  type TextRef = {
    hash: string
    text: string
    rowId: string
    field: string
  }
  const textRefs: TextRef[] = []
  async function addRef(rowId: string, field: string, text: string) {
    textRefs.push({ hash: await sha256(`${lang}:${text}`), text, rowId, field })
  }
  for (const row of sourceRows) {
    await addRef(row.id, 'name', row.name)
    if (row.description) await addRef(row.id, 'description', row.description)
    for (const [i, label] of (row.variants ?? []).entries()) {
      if (label) await addRef(row.id, `variant:${i}`, label)
    }
  }

  // שליפה מהמטמון בחלקים: מאות hash-ים בבקשה אחת יוצרים URL ארוך מדי
  const allHashes = [...new Set(textRefs.map((r) => r.hash))]
  const cacheMap = new Map<string, string>()
  for (let i = 0; i < allHashes.length; i += 100) {
    const { data: cachedRows } = await supabase
      .from('translation_cache')
      .select('source_hash, translated_text')
      .eq('lang', lang)
      .in('source_hash', allHashes.slice(i, i + 100))
    for (const row of cachedRows ?? []) cacheMap.set(row.source_hash, row.translated_text)
  }

  // אותו טקסט (למשל "120 גרם") מתורגם פעם אחת גם אם הוא מופיע בכמה מנות
  const missing = [
    ...new Map(
      textRefs.filter((r) => !cacheMap.has(r.hash)).map((r) => [r.hash, r]),
    ).values(),
  ]

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (missing.length > 0 && apiKey) {
    const anthropic = new Anthropic({ apiKey })
    const batches: TextRef[][] = []
    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      batches.push(missing.slice(i, i + BATCH_SIZE))
    }

    // כל חבילה נשמרת במטמון בנפרד — אם אחת נכשלת, השאר כבר מתורגמות
    async function translateBatch(batch: TextRef[]) {
      try {
        const payload = batch.map((m, i) => ({ i, text: m.text }))
        const message = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 8000,
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
        if (message.stop_reason === 'max_tokens') {
          console.error('translation batch truncated', lang, batch.length)
        }

        const textBlock = message.content.find((b) => b.type === 'text')
        const raw = textBlock && 'text' in textBlock ? textBlock.text : '[]'
        const jsonMatch = raw.match(/\[[\s\S]*\]/)
        const parsed: { i: number; t: string }[] = jsonMatch
          ? JSON.parse(jsonMatch[0])
          : []

        const upserts = []
        for (const { i, t } of parsed) {
          const ref = batch[i]
          if (!ref || typeof t !== 'string' || !t.trim()) continue
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
        console.error('translation batch failed', lang, err)
      }
    }

    for (let i = 0; i < batches.length; i += PARALLEL_BATCHES) {
      await Promise.all(batches.slice(i, i + PARALLEL_BATCHES).map(translateBatch))
    }
  }

  const translations: Record<
    string,
    { name: string; description?: string; variants?: string[] }
  > = {}
  for (const row of sourceRows) {
    const lookup = (field: string, fallback: string) => {
      const ref = textRefs.find((r) => r.rowId === row.id && r.field === field)
      return ref ? (cacheMap.get(ref.hash) ?? fallback) : fallback
    }
    translations[row.id] = {
      name: lookup('name', row.name),
      description: row.description ? lookup('description', row.description) : undefined,
      variants: row.variants?.map((label, i) =>
        label ? lookup(`variant:${i}`, label) : '',
      ),
    }
  }

  return NextResponse.json({ translations })
}
