import Link from 'next/link'
import {
  House,
  UtensilsCrossed,
  Images,
  FileText,
  Settings,
  ExternalLink,
  Megaphone,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

async function getCounts() {
  const supabase = await createClient()
  const [menuItems, galleryImages, pages, popups] = await Promise.all([
    supabase.from('menu_items').select('*', { count: 'exact', head: true }),
    supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
    supabase
      .from('pages')
      .select('*', { count: 'exact', head: true })
      .neq('slug', 'home'),
    supabase
      .from('popups')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
  ])
  return {
    menuItems: menuItems.count ?? 0,
    galleryImages: galleryImages.count ?? 0,
    pages: pages.count ?? 0,
    popups: popups.count ?? 0,
  }
}

export default async function AdminHomePage() {
  const counts = await getCounts()

  const actions = [
    {
      href: '/admin/pages/home',
      title: 'עריכת עמוד הבית',
      text: 'תמונה ראשית, טקסטים, מבצעים וסדר הסקשנים — עם תצוגה מקדימה חיה',
      icon: House,
    },
    {
      href: '/admin/menu',
      title: 'תפריט',
      text: `${counts.menuItems} מנות · מחירים, תמונות ותגיות`,
      icon: UtensilsCrossed,
    },
    {
      href: '/admin/pages',
      title: 'עמודים וניווט',
      text: `${counts.pages} עמודים נוספים · תפריט הניווט העליון`,
      icon: FileText,
    },
    {
      href: '/admin/popups',
      title: 'חלונות קופצים',
      text: `${counts.popups} פעילים · מבצעים מתוזמנים לפי ימים ושעות`,
      icon: Megaphone,
    },
    {
      href: '/admin/gallery',
      title: 'גלריה',
      text: `${counts.galleryImages} תמונות`,
      icon: Images,
    },
    {
      href: '/admin/settings',
      title: 'הגדרות',
      text: 'טלפון, וואטסאפ, כתובת, שעות פתיחה ורשתות',
      icon: Settings,
    },
  ]

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-bold">מה עורכים היום?</h1>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="text-ink-soft hover:text-ink flex items-center gap-1.5 text-sm font-semibold"
        >
          <ExternalLink className="size-4" />
          צפייה באתר
        </a>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map(({ href, title, text, icon: Icon }, i) => (
          <Link
            key={href}
            href={href}
            className={
              i === 0
                ? 'bg-ink text-paper hover:bg-ink-soft flex items-start gap-4 rounded-2xl p-5 sm:col-span-2'
                : 'border-ink/10 hover:border-ink flex items-start gap-4 rounded-2xl border bg-white p-5'
            }
          >
            <Icon className="mt-0.5 size-6 shrink-0" strokeWidth={1.75} />
            <span>
              <span className="block text-lg font-bold">{title}</span>
              <span
                className={i === 0 ? 'text-paper/70 text-sm' : 'text-ink-soft text-sm'}
              >
                {text}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
