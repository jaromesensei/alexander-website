import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'אלכסנדר | לוקאל דיינר, נהריה',
    short_name: 'אלכסנדר',
    description: 'דיינר אמריקאי רטרו בגרסה מודרנית, נהריה.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0b',
    theme_color: '#0a0a0b',
    icons: [
      { src: '/icons/192', sizes: '192x192', type: 'image/png' },
      { src: '/icons/512', sizes: '512x512', type: 'image/png' },
    ],
  }
}
