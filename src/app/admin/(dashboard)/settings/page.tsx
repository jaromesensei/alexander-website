import { createClient } from '@/lib/supabase/server'
import { fetchSettings } from '@/lib/data/settings'
import { FALLBACK_SETTINGS } from '@/lib/data/fallback'
import { SettingsAdminClient } from '@/components/admin/SettingsAdminClient'

export default async function AdminSettingsPage() {
  const settings = await fetchSettings(await createClient()).catch(
    () => FALLBACK_SETTINGS,
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">הגדרות המסעדה</h1>
        <p className="text-ink-soft">פרטים אלו מוצגים בכל האתר הציבורי.</p>
      </div>
      <SettingsAdminClient settings={settings} />
    </div>
  )
}
