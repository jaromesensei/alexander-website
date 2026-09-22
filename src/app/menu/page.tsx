import type { Metadata } from 'next'
import { getMenu } from '@/lib/data/menu'
import { getSettings } from '@/lib/data/settings'
import { Section, SectionHeading } from '@/components/ui/Section'
import { MenuPageClient } from '@/components/menu/MenuPageClient'
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
        <SectionHeading
          eyebrow="התפריט שלנו"
          title="כל מה שמבשלים היום"
          description="כל המנות מוכנות טריות מדי יום. לחצו על השפה למעלה כדי לראות את התפריט בשפה שלכם."
        />
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
