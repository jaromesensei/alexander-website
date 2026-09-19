import type { Metadata } from 'next'
import { getMenu } from '@/lib/data/menu'
import { Section, SectionHeading } from '@/components/ui/Section'
import { MenuPageClient } from '@/components/menu/MenuPageClient'

export const metadata: Metadata = {
  title: 'תפריט',
  description: 'התפריט המלא של אלכסנדר — המבורגרים, תוספות ושתייה. זמין בכל שפה.',
}

export default async function MenuPage() {
  const categories = await getMenu()

  return (
    <Section>
      <SectionHeading
        eyebrow="התפריט שלנו"
        title="כל מה שמבשלים היום"
        description="כל המנות מוכנות טריות מדי יום. לחצו על השפה למעלה כדי לראות את התפריט בשפה שלכם."
      />
      <MenuPageClient categories={categories} />
    </Section>
  )
}
