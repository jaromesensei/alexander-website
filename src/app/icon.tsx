import { ImageResponse } from 'next/og'
import { loadBebasFont, monogramStyle } from '@/lib/monogramIcon'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  const bebas = await loadBebasFont()

  return new ImageResponse(<div style={monogramStyle('#ff2f7e', 24)}>A</div>, {
    ...size,
    fonts: [{ name: 'Bebas', data: bebas, style: 'normal', weight: 400 }],
  })
}
