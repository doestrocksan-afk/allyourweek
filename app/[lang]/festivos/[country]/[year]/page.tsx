import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { SchemaHolidaysPage } from '@/components/Schema'
import { LANGS, LangCode, LANG_CODES } from '@/lib/i18n'
import { fetchHolidays } from '@/lib/holidays'
import { getISOWeek } from '@/lib/weeks'

const BASE_URL = 'https://allyourweek.com'
type Props = { params: Promise<{ lang: string; country: string; year: string }> }

export async function generateStaticParams() {
  const years = [2024, 2025, 2026, 2027, 2028]
  const params = []
  for (const lang of LANG_CODES) {
    for (const country of LANGS[lang as LangCode].countries) {
      for (const year of years) {
        params.push({ lang, country: country.slug, year: String(year) })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, country, year } = await params
  if (!LANG_CODES.includes(lang as LangCode)) return {}
  const L = LANGS[lang as LangCode]
  const countryConfig = L.countries.find(c => c.slug === country)
  if (!countryConfig) return {}
  const ogUrl = `${BASE_URL}/og?week=${encodeURIComponent(countryConfig.name)}&year=${year}&label=${encodeURIComponent(L.t.holidays)}&type=special`
  return {
    title: `${L.t.holidaysIn} ${countryConfig.name} ${year} | AllYourWeek.com`,
    description: `${L.t.holidays} ${countryConfig.name} ${year}.`,
    alternates: {
      canonical: `${BASE_URL}/${lang}/festivos/${country}/${year}`,
      languages: Object.fromEntries(LANG_CODES.map(l => [LANGS[l].hreflang, `${BASE_URL}/${l}/festivos/${country}/${year}`]))
    },
    openGraph: {
      title: `${L.t.holidaysIn} ${countryConfig.name} ${year}`,
      description: `${L.t.holidays} ${countryConfig.name} ${year}`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default async function HolidaysPage({ params }: Props) {
  const { lang, country, year } = await params
  if (!LANG_CODES.includes(lang as LangCode)) notFound()
  const L = LANGS[lang as LangCode]
  const countryConfig = L.countries.find(c => c.slug === country)
  if (!countryConfig) notFound()
  const y = parseInt(year)
  if (isNaN(y) || y < 2000 || y > 2100) notFound()
  const holidays = await fetchHolidays(countryConfig.code, y)
  const byMonth: Record<number, typeof holidays> = {}
  holidays.forEach(h => {
    const m = new Date(h.date + 'T00:00:00').getMonth()
    if (!byMonth[m]) byMonth[m] = []
    byMonth[m].push(h)
  })

  return (
    <>
      <SchemaHolidaysPage lang={lang as LangCode} country={countryConfig.name} year={y} holidays={holidays.map(h => ({ date: h.date, name: h.localName }))} />
      <Nav lang={lang as LangCode} />
      <main>
        <div className="page-header">
          <h1>{L.t.holidaysIn} {countryConfig.name} {y}</h1>
          <p>{holidays.length} {L.t.holidays.toLowerCase()}</p>
        </div>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 48px' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {L.countries.map(c => (
              <Link key={c.code} href={`/${lang}/festivos/${c.slug}/${y}`} className="quick-link" style={c.slug === country ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}>
                {c.name}
              </Link>
            ))}
            <span style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
            {[y - 1, y, y + 1].map(yr => (
              <Link key={yr} href={`/${lang}/festivos/${country}/${yr}`} className="quick-link" style={yr === y ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}>
                {yr}
              </Link>
            ))}
          </div>
          {Array.from({ length: 12 }, (_, m) => m).map(m => {
            const mh = byMonth[m] || []
            if (!mh.length) return null
            return (
              <section key={m} className="card" style={{ marginBottom: 16 }}>
                <h2 className="card-label">{L.months[m]} {y}</h2>
                <div className="holiday-list">
                  {mh.map(h => {
                    const d = new Date(h.date + 'T00:00:00')
                    const dow = (d.getDay() + 6) % 7
                    const { week } = getISOWeek(d)
                    return (
                      <div key={h.date + h.name} className="holiday-item">
                        <span className="holiday-date">{L.daysShort[dow]} {d.getDate()} {L.monthsShort[d.getMonth()]}</span>
                        <span className="holiday-name">{h.localName}</span>
                        <Link href={`/${lang}/${y}/${week}`} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                          {L.t.week} {week}
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
          <div style={{ marginTop: 8 }}>
            <Link href={`/${lang}/calendario/${y}`} className="quick-link">→ {L.t.calendar} {y}</Link>
          </div>
        </div>
      </main>
      <Footer lang={lang as LangCode} year={new Date().getFullYear()} />
    </>
  )
}
