'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Input, Label, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ImageUploadButton } from './ImageUploadButton'
import { HOURS_LABELS } from '@/lib/data/fallback'
import type { RestaurantSettings } from '@/types/db'

type Hours = RestaurantSettings['hours']

export function SettingsAdminClient({ settings }: { settings: RestaurantSettings }) {
  const router = useRouter()
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function set<K extends keyof RestaurantSettings>(key: K, value: RestaurantSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  function setHour(day: string, field: 'open' | 'close' | 'closed', value: string) {
    const hours: Hours = { ...form.hours }
    if (field === 'closed') {
      hours[day] = value === 'true' ? null : { open: '12:00', close: '22:00' }
    } else {
      const current = hours[day] ?? { open: '12:00', close: '22:00' }
      hours[day] = { ...current, [field]: value }
    }
    set('hours', hours)
  }

  async function save() {
    setSaving(true)
    const supabase = createClient()
    const payload = {
      name: form.name,
      tagline: form.tagline,
      about: form.about,
      hero_image_url: form.hero_image_url,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      address: form.address,
      map_url: form.map_url,
      lat: form.lat,
      lng: form.lng,
      hours: form.hours,
      instagram_url: form.instagram_url,
      facebook_url: form.facebook_url,
      wolt_url: form.wolt_url,
      tenbis_url: form.tenbis_url,
    }
    if (form.id === 'fallback') {
      await supabase.from('restaurant_settings').insert(payload)
    } else {
      await supabase.from('restaurant_settings').update(payload).eq('id', form.id)
    }
    setSaving(false)
    setSaved(true)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-6">
        <h2 className="font-display text-lg">פרטי המסעדה</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>שם</Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <Label>סלוגן</Label>
            <Input
              value={form.tagline ?? ''}
              onChange={(e) => set('tagline', e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>הסיפור שלנו (מוצג בעמוד הבית)</Label>
          <Textarea
            rows={4}
            value={form.about ?? ''}
            onChange={(e) => set('about', e.target.value)}
          />
        </div>
        <div>
          <Label>תמונת הירו (עמוד הבית)</Label>
          <ImageUploadButton
            value={form.hero_image_url}
            onChange={(url) => set('hero_image_url', url)}
            folder="hero"
          />
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-display text-lg">יצירת קשר ומיקום</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>טלפון</Label>
            <Input
              dir="ltr"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </div>
          <div>
            <Label>וואטסאפ (מספר בינלאומי, למשל 972501234567)</Label>
            <Input
              dir="ltr"
              value={form.whatsapp ?? ''}
              onChange={(e) => set('whatsapp', e.target.value)}
            />
          </div>
          <div>
            <Label>אימייל</Label>
            <Input
              dir="ltr"
              value={form.email ?? ''}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>
          <div>
            <Label>קישור לגוגל מפות</Label>
            <Input
              dir="ltr"
              value={form.map_url ?? ''}
              onChange={(e) => set('map_url', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>כתובת</Label>
            <Input
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
            />
          </div>
          <div>
            <Label>Latitude</Label>
            <Input
              dir="ltr"
              inputMode="decimal"
              value={form.lat ?? ''}
              onChange={(e) =>
                set('lat', e.target.value ? parseFloat(e.target.value) : null)
              }
            />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input
              dir="ltr"
              inputMode="decimal"
              value={form.lng ?? ''}
              onChange={(e) =>
                set('lng', e.target.value ? parseFloat(e.target.value) : null)
              }
            />
          </div>
        </div>
      </Card>

      <Card className="space-y-3 p-6">
        <h2 className="font-display text-lg">שעות פתיחה</h2>
        {HOURS_LABELS.map((label, i) => {
          const day = String(i)
          const h = form.hours[day]
          return (
            <div key={day} className="flex flex-wrap items-center gap-3">
              <span className="w-14 text-sm font-semibold">{label}</span>
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={!h}
                  onChange={(e) => setHour(day, 'closed', String(e.target.checked))}
                />
                סגור
              </label>
              {h && (
                <>
                  <Input
                    type="time"
                    className="h-9 w-32"
                    value={h.open}
                    onChange={(e) => setHour(day, 'open', e.target.value)}
                  />
                  <span>–</span>
                  <Input
                    type="time"
                    className="h-9 w-32"
                    value={h.close}
                    onChange={(e) => setHour(day, 'close', e.target.value)}
                  />
                </>
              )}
            </div>
          )
        })}
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-display text-lg">רשתות ומשלוחים</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>אינסטגרם</Label>
            <Input
              dir="ltr"
              value={form.instagram_url ?? ''}
              onChange={(e) => set('instagram_url', e.target.value)}
            />
          </div>
          <div>
            <Label>פייסבוק</Label>
            <Input
              dir="ltr"
              value={form.facebook_url ?? ''}
              onChange={(e) => set('facebook_url', e.target.value)}
            />
          </div>
          <div>
            <Label>קישור להזמנה ב-Wolt</Label>
            <Input
              dir="ltr"
              value={form.wolt_url ?? ''}
              onChange={(e) => set('wolt_url', e.target.value)}
            />
          </div>
          <div>
            <Label>קישור להזמנה ב-10ביס</Label>
            <Input
              dir="ltr"
              value={form.tenbis_url ?? ''}
              onChange={(e) => set('tenbis_url', e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving} size="lg">
          {saving ? 'שומר…' : 'שמירת הגדרות'}
        </Button>
        {saved && <span className="text-forest text-sm">נשמר בהצלחה</span>}
      </div>
    </div>
  )
}
