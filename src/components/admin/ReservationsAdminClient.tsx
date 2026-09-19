'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { formatDate, formatTime } from '@/lib/format'
import type { ReservationLead, ReservationStatus } from '@/types/db'

const statusLabels: Record<ReservationStatus, string> = {
  new: 'חדש',
  contacted: 'נוצר קשר',
  confirmed: 'אושר',
  declined: 'נדחה',
}

const statusTones: Record<ReservationStatus, string> = {
  new: 'bg-ketchup/10 text-ketchup',
  contacted: 'bg-mustard/20 text-mustard-dark',
  confirmed: 'bg-forest/10 text-forest',
  declined: 'bg-charcoal/10 text-charcoal-soft',
}

export function ReservationsAdminClient({ leads }: { leads: ReservationLead[] }) {
  const router = useRouter()

  async function updateStatus(id: string, status: ReservationStatus) {
    const supabase = createClient()
    await supabase.from('reservation_leads').update({ status }).eq('id', id)
    router.refresh()
  }

  if (leads.length === 0) {
    return <p className="text-charcoal-soft">אין בקשות הזמנה עדיין.</p>
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <Card
          key={lead.id}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{lead.name}</p>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusTones[lead.status]}`}
              >
                {statusLabels[lead.status]}
              </span>
            </div>
            <p className="text-charcoal-soft mt-1 text-sm" dir="ltr">
              {lead.phone}
            </p>
            <p className="text-charcoal-soft mt-1 text-sm">
              {formatDate(lead.wanted_date)} · {formatTime(lead.wanted_time)} ·{' '}
              {lead.party_size} סועדים
            </p>
            {lead.notes && (
              <p className="text-charcoal-soft mt-1 text-sm">{lead.notes}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${lead.phone}`}
              className="border-charcoal/15 hover:bg-cream-dark rounded-full border px-3 py-1.5 text-sm font-semibold"
            >
              התקשרות
            </a>
            <Select
              value={lead.status}
              onChange={(e) => updateStatus(lead.id, e.target.value as ReservationStatus)}
              className="h-10 w-36"
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </Card>
      ))}
    </div>
  )
}
