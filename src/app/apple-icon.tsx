import { ImageResponse } from 'next/og'
import { loadBebasFont, monogramStyle } from '@/lib/monogramIcon'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const bebas = await loadBebasFont()

  return new ImageResponse(<div style={monogramStyle('#000000', 120)}>A</div>, {
    ...size,
    fonts: [{ name: 'Bebas', data: bebas, style: 'normal', weight: 400 }],
  })
}
