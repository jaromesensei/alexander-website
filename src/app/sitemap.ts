import type { MetadataRoute } from 'next'
import { getPublishedPages } from '@/lib/data/pages'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const now = new Date()

  const fixed = ['', '/menu', '/gallery', '/contact'].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === '/menu' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1 : 0.8,
  }))

  const pages = (await getPublishedPages()).map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...fixed, ...pages]
}
