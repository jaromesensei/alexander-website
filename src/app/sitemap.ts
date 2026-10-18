import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const now = new Date()

  const routes = ['', '/menu', '/gallery', '/contact']

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === '/menu' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
