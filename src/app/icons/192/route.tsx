import { ImageResponse } from 'next/og'
import { loadBebasFont, monogramStyle } from '@/lib/monogramIcon'

export async function GET() {
  const bebas = await loadBebasFont()

  return new ImageResponse(<div style={monogramStyle('#000000', 130)}>A</div>, {
    width: 192,
    height: 192,
    fonts: [{ name: 'Bebas', data: bebas, style: 'normal', weight: 400 }],
    headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
  })
}
