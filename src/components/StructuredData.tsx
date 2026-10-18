import type { RestaurantSettings } from '@/types/db'

const SCHEMA_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export function StructuredData({ settings }: { settings: RestaurantSettings }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const openingHoursSpecification = SCHEMA_DAYS.map((dayOfWeek, i) => {
    const h = settings.hours[String(i)]
    if (!h) return null
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek,
      opens: h.open,
      closes: h.close,
    }
  }).filter(Boolean)

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: settings.name,
    description: settings.tagline ?? undefined,
    image: settings.hero_image_url ?? undefined,
    url: baseUrl,
    telephone: settings.phone,
    email: settings.email ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressCountry: 'IL',
    },
    geo:
      settings.lat && settings.lng
        ? { '@type': 'GeoCoordinates', latitude: settings.lat, longitude: settings.lng }
        : undefined,
    openingHoursSpecification:
      openingHoursSpecification.length > 0 ? openingHoursSpecification : undefined,
    sameAs: [settings.instagram_url, settings.facebook_url].filter(Boolean),
    menu: `${baseUrl}/menu`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
