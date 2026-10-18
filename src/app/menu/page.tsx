import type { Metadata } from 'next'
import { getMenu } from '@/lib/data/menu'
import { getSettings } from '@/lib/data/settings'
import { Section } from '@/components/ui/Section'
import { MenuPageClient } from '@/components/menu/MenuPageClient'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { PageCTA } from '@/components/ui/PageCTA'
import { waLink, WA_MESSAGES } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'תפריט',
  description: 'התפריט המלא של אלכסנדר — המבורגרים, תוספות ושתייה. זמין בכל שפה.',
}

export default async function MenuPage() {
  const [categories, settings] = await Promise.all([getMenu(), getSettings()])

  return (
    <>
      <Section>
        <div className="mb-10">
          <h1 className="text-4xl leading-tight sm:text-5xl">תפריט</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-ink-soft">התפריט בשפה שלכם:</span>
            <LanguageSwitcher />
          </div>
        </div>
        <MenuPageClient categories={categories} />
      </Section>
      <PageCTA
        title="החלטתם? נשמור לכם שולחן"
        primary={{
          href:
            waLink(settings.whatsapp, WA_MESSAGES.reservation) ?? `tel:${settings.phone}`,
          label: 'הזמנת שולחן',
          target: '_blank',
        }}
        secondary={{ href: '/gallery', label: 'לגלריה' }}
      />
    </>
  )
}
