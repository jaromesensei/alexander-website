import type { Metadata } from 'next'
import { getMenu } from '@/lib/data/menu'
import { getSettings } from '@/lib/data/settings'
import { Section } from '@/components/ui/Section'
import { MenuPageClient } from '@/components/menu/MenuPageClient'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { PageCTA } from '@/components/ui/PageCTA'
import { waHref } from '@/lib/links'
import { siteText } from '@/lib/siteTexts'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: siteText(settings, 'menu.title'),
    description: 'התפריט המלא של אלכסנדר — המבורגרים, תוספות ושתייה. זמין בכל שפה.',
  }
}

export default async function MenuPage() {
  const [categories, settings] = await Promise.all([getMenu(), getSettings()])
  const t = (key: Parameters<typeof siteText>[1]) => siteText(settings, key)

  return (
    <>
      <Section>
        <div className="mb-10">
          <h1 className="text-4xl leading-tight sm:text-5xl">{t('menu.title')}</h1>
          {t('menu.intro') && (
            <p className="text-ink-soft mt-4 max-w-2xl text-lg whitespace-pre-line">
              {t('menu.intro')}
            </p>
          )}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-ink-soft">{t('menu.langLabel')}</span>
            <LanguageSwitcher />
          </div>
        </div>
        <MenuPageClient categories={categories} emptyText={t('menu.empty')} />
      </Section>
      <PageCTA
        title={t('menu.ctaTitle')}
        primary={{
          href: waHref(settings, 'reservation'),
          label: t('menu.ctaPrimary'),
          target: '_blank',
        }}
        secondary={{ href: '/gallery', label: t('menu.ctaSecondary') }}
      />
    </>
  )
}
