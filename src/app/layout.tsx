import type { Metadata } from 'next'
import { Heebo, Rubik, Bebas_Neue } from 'next/font/google'
import { LanguageProvider } from '@/lib/i18n/LanguageProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileActionBar } from '@/components/layout/MobileActionBar'
import { ChromeGate } from '@/components/layout/ChromeGate'
import { getSettings } from '@/lib/data/settings'
import './globals.css'

const heebo = Heebo({
  variable: '--font-heebo',
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '600', '700'],
})

const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['hebrew', 'latin'],
  weight: ['700', '800', '900'],
})

const bebasNeue = Bebas_Neue({
  variable: '--font-wordmark',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'אלכסנדר | לוקאל דיינר, נהריה',
    template: '%s | אלכסנדר',
  },
  description:
    'אלכסנדר לוקאל דיינר, נהריה — דיינר אמריקאי רטרו בגרסה מודרנית. תפריט מלא בכל שפה, שעות פתיחה ומיקום.',
  openGraph: {
    title: 'אלכסנדר | לוקאל דיינר, נהריה',
    description: 'טעם טוב. אנשים טובים. בלי ערבים משעממים.',
    locale: 'he_IL',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${rubik.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="bg-paper text-ink flex min-h-full flex-col">
        <LanguageProvider>
          <ChromeGate>
            <Header settings={settings} />
          </ChromeGate>
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <ChromeGate>
            <Footer settings={settings} />
            <MobileActionBar settings={settings} />
          </ChromeGate>
        </LanguageProvider>
      </body>
    </html>
  )
}
