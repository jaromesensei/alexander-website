import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { getSettings } from '@/lib/data/settings'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Satori (מנוע next/og) מזהה עברית ומהפך את כל המחרוזת לבד (לא Unicode BiDi
 * אמיתי — פשוט הופך את סדר התווים). לכן מזינים לו מחרוזת הפוכה-מראש, וההיפוך
 * הכפול מחזיר את הטקסט לסדר הנכון.
 */
function rtlLine(text: string): string {
  return [...text].reverse().join('')
}

export default async function OpengraphImage() {
  const fontsDir = join(process.cwd(), 'public/fonts')
  const [settings, bebas, heebo] = await Promise.all([
    getSettings(),
    readFile(join(fontsDir, 'BebasNeue.woff')),
    readFile(join(fontsDir, 'HeeboHebrew700.woff')),
  ])

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: '#0a0a0b',
        backgroundImage:
          'radial-gradient(circle at 15% 15%, rgba(20,184,174,0.35), transparent 55%), radial-gradient(circle at 85% 85%, rgba(255,47,126,0.35), transparent 55%)',
        padding: '80px',
      }}
    >
      <div
        style={{
          fontFamily: 'Heebo',
          fontSize: 28,
          letterSpacing: 6,
          color: '#14b8ae',
          marginBottom: 20,
        }}
      >
        {rtlLine('נהריה · לוקאל דיינר')}
      </div>
      <div
        style={{
          fontFamily: 'Bebas',
          fontSize: 200,
          lineHeight: 0.9,
          color: '#ffffff',
          textTransform: 'uppercase',
        }}
      >
        Alexander
      </div>
      {settings.tagline && (
        <div
          style={{
            fontFamily: 'Heebo',
            fontSize: 36,
            color: 'rgba(255,255,255,0.85)',
            marginTop: 28,
          }}
        >
          {rtlLine(settings.tagline)}
        </div>
      )}
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Bebas', data: bebas, style: 'normal', weight: 400 },
        { name: 'Heebo', data: heebo, style: 'normal', weight: 700 },
      ],
    },
  )
}
