import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { getSettings } from '@/lib/data/settings'
import { siteText } from '@/lib/siteTexts'

export default async function NotFound() {
  const settings = await getSettings()
  const t = (key: Parameters<typeof siteText>[1]) => siteText(settings, key)

  return (
    <section className="bg-ink text-paper flex min-h-[80svh] items-center">
      <Container>
        <p
          className="font-wordmark text-paper/60 text-8xl leading-none"
          aria-hidden="true"
        >
          404
        </p>
        <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{t('notFound.title')}</h1>
        <p className="text-paper/70 mt-4 max-w-sm text-lg whitespace-pre-line">
          {t('notFound.text')}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" size="lg">
            {t('notFound.home')}
          </ButtonLink>
          <ButtonLink href="/menu" variant="outlineInverse" size="lg">
            {t('notFound.menu')}
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
