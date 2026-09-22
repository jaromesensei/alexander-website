'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  UtensilsCrossed,
  Images,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const items = [
  { href: '/admin', label: 'סקירה', icon: LayoutDashboard },
  { href: '/admin/menu', label: 'תפריט', icon: UtensilsCrossed },
  { href: '/admin/gallery', label: 'גלריה', icon: Images },
  { href: '/admin/settings', label: 'הגדרות', icon: Settings },
] as const

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <nav className="border-ink/10 flex h-14 items-center gap-1 overflow-x-auto border-b bg-white px-3 sm:h-auto sm:w-60 sm:flex-col sm:items-stretch sm:border-e sm:border-b-0 sm:px-3 sm:py-6">
      <Link
        href="/"
        target="_blank"
        className="text-ink-soft hover:text-pink mb-4 hidden items-center gap-2 px-3 text-sm sm:flex"
      >
        <ExternalLink className="size-4" />
        צפייה באתר
      </Link>
      {items.map(({ href, label, icon: Icon }) => {
        const active =
          href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold whitespace-nowrap',
              active ? 'bg-pink/10 text-pink' : 'text-ink hover:bg-paper-dark',
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        )
      })}
      <button
        type="button"
        onClick={logout}
        className="text-ink-soft hover:bg-paper-dark mt-auto flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold sm:mt-6"
      >
        <LogOut className="size-4" />
        התנתקות
      </button>
    </nav>
  )
}
