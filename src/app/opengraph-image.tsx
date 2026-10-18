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
        justifyContent: 'flex-end',
        backgroundColor: '#000000',
        padding: '72px 80px',
      }}
    >
      <div
        style={{
          fontFamily: 'Bebas',
          fontSize: 260,
          lineHeight: 0.85,
          color: '#ffffff',
          textTransform: 'uppercase',
        }}
      >
        Alexander
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          width: '100%',
          borderTop: '2px solid rgba(255,255,255,0.2)',
          marginTop: 32,
          paddingTop: 28,
        }}
      >
        {settings.tagline && (
          <div style={{ fontFamily: 'Heebo', fontSize: 40, color: '#ffffff' }}>
            {rtlLine(settings.tagline)}
          </div>
        )}
        <div
          style={{
            fontFamily: 'Heebo',
            fontSize: 28,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 8,
          }}
        >
          {rtlLine('לוקאל דיינר, נהריה')}
        </div>
      </div>
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
