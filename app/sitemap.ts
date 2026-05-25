import { MetadataRoute } from 'next'
import { LANG_CODES, LANGS, LangCode } from '@/lib/i18n'
import { getWeeksInYear } from '@/lib/weeks'
import { SPECIAL_SLUGS, SPECIAL_KEYS } from '@/lib/special'

const BASE_URL = 'https://allyourweek.com'
const YEARS = [2024, 2025, 2026, 2027, 2028]

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = []
  const now = new Date()

  // Root redirect — low priority
  urls.push({ url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 0.5 })

  for (const lang of LANG_CODES) {
    const L = LANGS[lang as LangCode]

    // ── Home (current week) ──────────────────────────────────
    urls.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    })

    for (const year of YEARS) {
      const totalWeeks = getWeeksInYear(year)
      const isCurrentYear = year === now.getFullYear()
      const currentWeek = isCurrentYear
        ? Math.ceil((now.getTime() - new Date(year, 0, 1).getTime()) / 604800000)
        : 0

      // ── Week pages ─────────────────────────────────────────
      for (let week = 1; week <= totalWeeks; week++) {
        const isPast = year < now.getFullYear() || (isCurrentYear && week < currentWeek)
        const isCurrent = isCurrentYear && week === currentWeek
        urls.push({
          url: `${BASE_URL}/${lang}/${year}/${week}`,
          lastModified: now,
          changeFrequency: isCurrent ? 'daily' : isPast ? 'yearly' : 'monthly',
          priority: isCurrent ? 0.9 : isPast ? 0.5 : 0.7,
        })
      }

      // ── Special dates ──────────────────────────────────────
      for (const key of SPECIAL_KEYS) {
        const slug = SPECIAL_SLUGS[key][lang as LangCode]
        urls.push({
          url: `${BASE_URL}/${lang}/${year}/${slug}`,
          lastModified: now,
          changeFrequency: 'yearly',
          priority: 0.8,
        })
      }

      // ── Calendar ───────────────────────────────────────────
      urls.push({
        url: `${BASE_URL}/${lang}/calendario/${year}`,
        lastModified: now,
        changeFrequency: isCurrentYear ? 'monthly' : 'yearly',
        priority: isCurrentYear ? 0.8 : 0.6,
      })

      // ── Holidays by country ────────────────────────────────
      for (const country of L.countries) {
        urls.push({
          url: `${BASE_URL}/${lang}/festivos/${country.slug}/${year}`,
          lastModified: now,
          changeFrequency: isCurrentYear ? 'monthly' : 'yearly',
          priority: isCurrentYear ? 0.75 : 0.55,
        })
      }
    }
  }

  return urls
}
