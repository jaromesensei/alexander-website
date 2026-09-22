import type { Metadata } from 'next'
import { Heebo, Suez_One } from 'next/font/google'
import { LanguageProvider } from '@/lib/i18n/LanguageProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ChromeGate } from '@/components/layout/ChromeGate'
import './globals.css'

const heebo = Heebo({
  variable: '--font-heebo',
  subsets: ['hebrew', 'latin'],
})

const suez = Suez_One({
  variable: '--font-suez',
  weight: '400',
  subsets: ['hebrew', 'latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'אלכסנדר | דיינר משפחתי בנהריה',
    template: '%s | אלכסנדר',
  },
  description:
    'אלכסנדר — דיינר משפחתי בנהריה. המבורגרים, אווירה חמה וטעם של בית. תפריט מלא בכל שפה, שעות פתיחה ומיקום.',
  openGraph: {
    title: 'אלכסנדר | דיינר משפחתי בנהריה',
    description: 'המבורגרים, אווירה חמה וטעם של בית. תפריט מלא בכל שפה.',
    locale: 'he_IL',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${suez.variable} h-full antialiased`}
    >
      <body className="bg-cream text-charcoal flex min-h-full flex-col">
        <LanguageProvider>
          <ChromeGate>
            <Header />
          </ChromeGate>
          <main className="flex-1">{children}</main>
          <ChromeGate>
            <Footer />
          </ChromeGate>
        </LanguageProvider>
      </body>
    </html>
  )
}
