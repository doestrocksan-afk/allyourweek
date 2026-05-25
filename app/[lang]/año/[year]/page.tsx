import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { LANGS, LangCode, LANG_CODES } from '@/lib/i18n'
import { getWeeksInYear, getWeekRange, getISOWeek, getSpecialDates } from '@/lib/weeks'
import { fetchHolidays } from '@/lib/holidays'
import { SPECIAL_KEYS, SPECIAL_NAMES, SPECIAL_SLUGS, getSpecialDateForYear } from '@/lib/special'

const BASE_URL = 'https://allyourweek.com'
type Props = { params: Promise<{ lang: string; year: string }> }

export async function generateStaticParams() {
  const years = [2024, 2025, 2026, 2027, 2028]
  return LANG_CODES.flatMap(lang => years.map(year => ({ lang, year: String(year) })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, year } = await params
  if (!LANG_CODES.includes(lang as LangCode)) return {}
  const L = LANGS[lang as LangCode]
  const y = parseInt(year)
  const ogUrl = `${BASE_URL}/og?week=${y}&year=${y}&label=${encodeURIComponent(L.t.calendar)}&type=special`
  return {
    title: `${y} | ${L.t.calendar} ${y} | AllYourWeek.com`,
    description: `${L.t.calendar} ${y}. ${getWeeksInYear(y)} ${L.t.weekOf52.replace('52', '')} — ${L.t.holidays}.`,
    alternates: {
      canonical: `${BASE_URL}/${lang}/año/${y}`,
      languages: Object.fromEntries(LANG_CODES.map(l => [LANGS[l].hreflang, `${BASE_URL}/${l}/año/${y}`]))
    },
    openGraph: {
      title: `${y} | AllYourWeek.com`,
      description: `${L.t.calendar} ${y}`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default async function YearPage({ params }: Props) {
  const { lang, year } = await params
  if (!LANG_CODES.includes(lang as LangCode)) notFound()
  const y = parseInt(year)
  if (isNaN(y) || y < 2000 || y > 2100) notFound()

  const L = LANGS[lang as LangCode]
  const totalWeeks = getWeeksInYear(y)
  const defaultCountry = L.countries[0]
  const holidays = await fetchHolidays(defaultCountry.code, y)
  const holidayDates = new Set(holidays.map(h => h.date))
  const today = new Date()
  const { week: currentWeek, year: currentYear } = getISOWeek(today)
  const isCurrentYear = y === currentYear

  // Special dates for this year
  const specials = SPECIAL_KEYS.map(key => ({
    key,
    name: SPECIAL_NAMES[key][lang as LangCode],
    slug: SPECIAL_SLUGS[key][lang as LangCode],
    date: getSpecialDateForYear(key, y),
  })).sort((a, b) => a.date.getTime() - b.date.getTime())

  // Build all weeks with metadata
  const weeks = Array.from({ length: totalWeeks }, (_, i) => {
    const w = i + 1
    const { start, end } = getWeekRange(w, y)
    const startStr = start.toISOString().slice(0, 10)
    const endStr = end.toISOString().slice(0, 10)
    const hasHoliday = holidays.some(h => h.date >= startStr && h.date <= endStr)
    const holidayNames = holidays.filter(h => h.date >= startStr && h.date <= endStr).map(h => h.localName)
    const isPast = isCurrentYear ? w < currentWeek : y < currentYear
    const isCurrent = isCurrentYear && w === currentWeek
    const rangeStr = `${start.getDate()} ${L.monthsShort[start.getMonth()]} – ${end.getDate()} ${L.monthsShort[end.getMonth()]}`
    return { w, start, end, startStr, rangeStr, hasHoliday, holidayNames, isPast, isCurrent }
  })

  // Group weeks by quarter
  const quarters = [
    { label: 'Q1', weeks: weeks.filter(w => w.start.getMonth() < 3) },
    { label: 'Q2', weeks: weeks.filter(w => w.start.getMonth() >= 3 && w.start.getMonth() < 6) },
    { label: 'Q3', weeks: weeks.filter(w => w.start.getMonth() >= 6 && w.start.getMonth() < 9) },
    { label: 'Q4', weeks: weeks.filter(w => w.start.getMonth() >= 9) },
  ]

  return (
    <>
      <Nav lang={lang as LangCode} />
      <main>
        <div className="page-header">
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(48px, 10vw, 96px)', color: 'var(--accent)', lineHeight: 1 }}>{y}</h1>
          <p>{totalWeeks} {L.t.week.toLowerCase()}s · {holidays.length} {L.t.holidays.toLowerCase()} · {defaultCountry.name}</p>
        </div>

        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 48px', display: 'grid', gap: 16 }}>

          {/* Year nav */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href={`/${lang}/año/${y - 1}`} className="quick-link">← {y - 1}</Link>
            {isCurrentYear && <Link href={`/${lang}`} className="quick-link" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>{L.t.currentWeek}</Link>}
            <Link href={`/${lang}/año/${y + 1}`} className="quick-link">{y + 1} →</Link>
            <Link href={`/${lang}/calendario/${y}`} className="quick-link">{L.t.calendar} →</Link>
            <Link href={`/${lang}/festivos/${defaultCountry.slug}/${y}`} className="quick-link">{L.t.holidays} →</Link>
          </div>

          {/* Key dates */}
          <section className="card">
            <h2 className="card-label">{y} — {L.t.holidays}</h2>
            <div className="quick-links" style={{ marginBottom: 16 }}>
              {specials.map(s => (
                <Link key={s.key} href={`/${lang}/${y}/${s.slug}`} className="quick-link">
                  {s.name} — {s.date.getDate()} {L.monthsShort[s.date.getMonth()]}
                </Link>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="card">
            <h2 className="card-label">{y}</h2>
            <div className="facts-grid">
              <div className="fact"><div className="fact-value">{totalWeeks}</div><div className="fact-label">{L.t.week.toLowerCase()}s</div></div>
              <div className="fact"><div className="fact-value">{holidays.length}</div><div className="fact-label">{L.t.holidays.toLowerCase()}</div></div>
              <div className="fact"><div className="fact-value">{weeks.filter(w => w.hasHoliday).length}</div><div className="fact-label">{L.t.week.toLowerCase()}s con festivo</div></div>
              <div className="fact"><div className="fact-value">{y % 4 === 0 ? 366 : 365}</div><div className="fact-label">días</div></div>
            </div>
          </section>

          {/* All weeks by quarter */}
          {quarters.map(q => q.weeks.length > 0 && (
            <section key={q.label} className="card">
              <h2 className="card-label">{q.label} · {y}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 6 }}>
                {q.weeks.map(({ w, rangeStr, hasHoliday, holidayNames, isPast, isCurrent }) => (
                  <Link
                    key={w}
                    href={`/${lang}/${y}/${w}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 10px',
                      background: isCurrent ? 'rgba(232,197,71,0.1)' : 'var(--bg3)',
                      border: `1px solid ${isCurrent ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 5,
                      color: isPast ? 'var(--muted)' : 'var(--text)',
                      textDecoration: 'none',
                      transition: 'border-color .15s',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: isCurrent ? 'var(--accent)' : 'var(--muted)', minWidth: 24 }}>{w}</span>
                    <span style={{ fontSize: 11, flex: 1 }}>{rangeStr}</span>
                    {hasHoliday && (
                      <span title={holidayNames.join(', ')} style={{ fontSize: 10, color: '#5a9', fontFamily: 'var(--font-mono)' }}>★</span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}

        </div>
      </main>
      <Footer lang={lang as LangCode} year={new Date().getFullYear()} />
    </>
  )
}
