import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { SchemaCalendarPage } from '@/components/Schema'
import { LANGS, LangCode, LANG_CODES } from '@/lib/i18n'
import { getISOWeek, getWeeksInYear } from '@/lib/weeks'
import { fetchHolidays } from '@/lib/holidays'

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
  const ogUrl = `${BASE_URL}/og?week=${y}&year=${y}&label=${encodeURIComponent(L.t.calendarYear)}&type=special`
  return {
    title: `${L.t.calendar} ${year} | AllYourWeek.com`,
    description: `${L.t.calendarYear} ${year} — ${L.t.holidays}`,
    alternates: {
      canonical: `${BASE_URL}/${lang}/calendario/${y}`,
      languages: Object.fromEntries(LANG_CODES.map(l => [LANGS[l].hreflang, `${BASE_URL}/${l}/calendario/${y}`]))
    },
    openGraph: {
      title: `${L.t.calendar} ${year}`,
      description: `${L.t.calendarYear} ${year}`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default async function CalendarPage({ params }: Props) {
  const { lang, year } = await params
  if (!LANG_CODES.includes(lang as LangCode)) notFound()
  const y = parseInt(year)
  if (isNaN(y) || y < 2000 || y > 2100) notFound()
  const L = LANGS[lang as LangCode]
  const defaultCountry = L.countries[0]
  const holidays = await fetchHolidays(defaultCountry.code, y)
  const holidayDates = new Set(holidays.map(h => h.date))
  const holidayNames: Record<string, string> = {}
  holidays.forEach(h => { holidayNames[h.date] = h.localName })
  const today = new Date().toISOString().slice(0, 10)

  const months = Array.from({ length: 12 }, (_, m) => {
    const firstDay = new Date(y, m, 1)
    const lastDay = new Date(y, m + 1, 0)
    const startDow = (firstDay.getDay() + 6) % 7
    const days = []
    for (let i = 0; i < startDow; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(y, m, d)
      const dateStr = date.toISOString().slice(0, 10)
      const dow = (date.getDay() + 6) % 7
      const { week } = getISOWeek(date)
      days.push({ d, dateStr, dow, week, isToday: dateStr === today, isHoliday: holidayDates.has(dateStr), holidayName: holidayNames[dateStr] })
    }
    return { month: m, days }
  })

  return (
    <>
      <SchemaCalendarPage lang={lang as LangCode} year={y} country={defaultCountry.name} />
      <Nav lang={lang as LangCode} />
      <main>
        <div className="page-header">
          <h1>{L.t.calendar} {y}</h1>
          <p>{L.t.holidays} · {defaultCountry.name}</p>
        </div>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 48px' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            <Link href={`/${lang}/calendario/${y - 1}`} className="quick-link">← {y - 1}</Link>
            <Link href={`/${lang}`} className="quick-link">{L.t.currentWeek}</Link>
            <Link href={`/${lang}/año/${y}`} className="quick-link">{y} →</Link>
            <Link href={`/${lang}/calendario/${y + 1}`} className="quick-link">{y + 1} →</Link>
          </div>
          <div className="calendar-grid">
            {months.map(({ month, days }) => (
              <section key={month} className="month-card">
                <h2 className="month-title">{L.months[month]} {y}</h2>
                <div className="month-grid">
                  <div className="month-dow" style={{ fontSize: 9, color: 'var(--muted2)' }}>W</div>
                  {L.daysShort.map(d => <div key={d} className="month-dow">{d}</div>)}
                  {days.map((day, i) => {
                    if (!day) return i === 0 ? <div key={`we${i}`} className="week-num" /> : <div key={`e${i}`} className="month-day other" />
                    const showWeek = day.dow === 0
                    return (
                      <>
                        {showWeek && (
                          <div key={`w${day.week}-${day.d}`} className="week-num">
                            <Link href={`/${lang}/${y}/${day.week}`} style={{ color: 'var(--muted2)' }}>{day.week}</Link>
                          </div>
                        )}
                        <div key={day.dateStr} className={`month-day ${day.dow >= 5 ? 'weekend' : ''} ${day.isToday ? 'is-today' : ''} ${day.isHoliday ? 'has-holiday' : ''}`} title={day.holidayName}>
                          <Link href={`/${lang}/${y}/${day.week}`} style={{ color: 'inherit' }}>{day.d}</Link>
                        </div>
                      </>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer lang={lang as LangCode} year={new Date().getFullYear()} />
    </>
  )
}
