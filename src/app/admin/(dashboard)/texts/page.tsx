import { createClient } from '@/lib/supabase/server'
import { fetchSettings } from '@/lib/data/settings'
import { FALLBACK_SETTINGS } from '@/lib/data/fallback'
import { SiteTextsEditor } from '@/components/admin/SiteTextsEditor'

export default async function AdminTextsPage() {
  const settings = await fetchSettings(await createClient()).catch(
    () => FALLBACK_SETTINGS,
  )

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">טקסטים באתר</h1>
        <p className="text-ink-soft">
          כותרות, כפתורים והודעות שמופיעים בעמודים הקבועים, בתפריט העליון ובפוטר. שדה ריק
          = הטקסט המקורי (מופיע באפור).
        </p>
      </div>
      <SiteTextsEditor settingsId={settings.id} initial={settings.site_texts ?? {}} />
    </div>
  )
}
