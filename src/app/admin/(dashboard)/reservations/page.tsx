import { createClient } from '@/lib/supabase/server'
import { ReservationsAdminClient } from '@/components/admin/ReservationsAdminClient'
import type { ReservationLead } from '@/types/db'

export default async function AdminReservationsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reservation_leads')
    .select('*')
    .order('wanted_date', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">בקשות הזמנת שולחן</h1>
        <p className="text-charcoal-soft">
          בקשות שהתקבלו דרך האתר, מסודרות לפי תאריך מבוקש.
        </p>
      </div>
      <ReservationsAdminClient leads={(data as ReservationLead[]) ?? []} />
    </div>
  )
}
