import Link from 'next/link'
import { LayoutGrid, UtensilsCrossed, Images } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'

async function getCounts() {
  const supabase = await createClient()
  const [{ count: categories }, { count: menuItems }, { count: galleryImages }] =
    await Promise.all([
      supabase.from('menu_categories').select('*', { count: 'exact', head: true }),
      supabase.from('menu_items').select('*', { count: 'exact', head: true }),
      supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
    ])
  return {
    categories: categories ?? 0,
    menuItems: menuItems ?? 0,
    galleryImages: galleryImages ?? 0,
  }
}

export default async function AdminHomePage() {
  const counts = await getCounts()

  const stats = [
    {
      href: '/admin/menu',
      label: 'קטגוריות בתפריט',
      value: counts.categories,
      icon: LayoutGrid,
    },
    {
      href: '/admin/menu',
      label: 'מנות בתפריט',
      value: counts.menuItems,
      icon: UtensilsCrossed,
    },
    {
      href: '/admin/gallery',
      label: 'תמונות בגלריה',
      value: counts.galleryImages,
      icon: Images,
    },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">סקירה כללית</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ href, label, value, icon: Icon }) => (
          <Link key={label} href={href}>
            <Card className="hover:border-ketchup/40 flex items-center gap-4 p-6">
              <div className="bg-ketchup/10 text-ketchup flex size-11 items-center justify-center rounded-xl">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-charcoal-soft text-sm">{label}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
