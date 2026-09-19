import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/AdminNav'

function SupabaseNotConfigured() {
  return (
    <div className="bg-charcoal text-cream flex min-h-svh items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-mustard text-2xl">Supabase עדיין לא מוגדר</p>
        <p className="text-cream/80 mt-3">
          כדי לגשת לניהול, יש להגדיר פרויקט Supabase ולמלא את הערכים ב-{' '}
          <code dir="ltr">.env.local</code>. הוראות מלאות ב-
          <code dir="ltr">supabase/README.md</code>.
        </p>
      </div>
    </div>
  )
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return <SupabaseNotConfigured />
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="bg-cream flex min-h-svh flex-col sm:flex-row">
      <AdminNav />
      <div className="flex-1 p-4 sm:p-8">{children}</div>
    </div>
  )
}
