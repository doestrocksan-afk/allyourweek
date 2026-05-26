import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SearchBox from '@/components/SearchBox'
import HolidayList from '@/components/HolidayList'
import MiniCal from '@/components/MiniCal'
import { SchemaHomePage } from '@/components/Schema'
import { LANGS, LangCode, LANG_CODES } from '@/lib/i18n'
import { getISOWeek, getWeekRange, getWeeksInYear, getDayOfYear } from '@/lib/weeks'
import { toLocalISODate } from '@/lib/dateUtils'

const BASE_URL = 'https://allyourweek.com'

// ISR — rebuild every 30 min. No force-dynamic = no edge request per visit
export const revalidate = 1800

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
  return LANG_CODES.map(lang => ({ lang }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!LANG_CODES.includes(lang as LangCode)) return {}
  const L = LANGS[lang as LangCode]
  const now = new Date()
  const { week, year } = getISOWeek(now)
  const { start, end } = getWeekRange(week, year)
  const rangeStr = `${start.getDate()} ${L.monthsShort[start.getMonth()]} – ${end.getDate()} ${L.monthsShort[end.getMonth()]} ${year}`
  const ogUrl = `${BASE_URL}/og?week=${week}&year=${year}&label=${encodeURIComponent(L.t.currentWeek)}&range=${encodeURIComponent(rangeStr)}&type=week`
  return {
    title: `${L.t.currentWeek} — ${L.t.week} ${week} | AllYourWeek.com`,
    description: L.t.metaHome,
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages: Object.fromEntries(LANG_CODES.map(l => [LANGS[l].hreflang, `${BASE_URL}/${l}`]))
    },
    openGraph: {
      title: `${L.t.week} ${week}, ${year}`,
      description: rangeStr,
      url: `${BASE_URL}/${lang}`,
      siteName: 'AllYourWeek.com',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      locale: L.hreflang,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default async function LangHome({ params }: Props) {
  const { lang } = await params
  if (!LANG_CODES.includes(lang as LangCode)) notFound()
  const L = LANGS[lang as LangCode]

  const now = new Date()
  const today = toLocalISODate(now)
  const { week, year } = getISOWeek(now)
  const { start, end } = getWeekRange(week, year)
  const totalWeeks = getWeeksInYear(year)
  const dayOfYear = getDayOfYear(start)
  const daysLeft = 365 - getDayOfYear(end)
  const startStr = toLocalISODate(start)
  const endStr = toLocalISODate(end)
  const rangeStr = `${L.days[(start.getDay() + 6) % 7]} ${start.getDate()} ${L.months[start.getMonth()]} – ${L.days[(end.getDay() + 6) % 7]} ${end.getDate()} ${L.months[end.getMonth()]}`
  const quickWeeks = Array.from({ length: 10 }, (_, i) => week - 3 + i).filter(w => w >= 1 && w <= totalWeeks)
  const defaultCountry = L.countries[0].code
  const pageUrl = `/${lang}`

  return (
    <>
      <SchemaHomePage lang={lang as LangCode} />
      <Nav lang={lang as LangCode} />
      <main>
        <div className="hero">
          <p className="hero-label">{L.t.currentWeek}</p>
          <h1 className="hero-number">{week}</h1>
          <div className="hero-divider" />
          <h2 className="hero-range">{rangeStr}</h2>
          <p className="hero-year">{year}</p>
        </div>
        <SearchBox lang={lang as LangCode} currentYear={year} />
        <div className="page-content">
          <section className="card">
            <h2 className="card-label">{L.t.holidaysThisWeek}</h2>
            <HolidayList lang={lang as LangCode} weekStart={startStr} weekEnd={endStr} year={year} activeCountry={defaultCountry} pageUrl={pageUrl} isCurrentWeek={true} />
          </section>
          <section className="card">
            <MiniCal lang={lang as LangCode} week={week} year={year} today={today} countryCode={defaultCountry} />
          </section>
          <section className="card">
            <h2 className="card-label">{L.t.weekAtAGlance}</h2>
            <div className="facts-grid">
              <div className="fact"><div className="fact-value">{week}</div><div className="fact-label">{L.t.weekOf52.replace('52', String(totalWeeks))}</div></div>
              <div className="fact"><div className="fact-value">{Math.round(week / totalWeeks * 100)}%</div><div className="fact-label">{L.t.yearDone}</div></div>
              <div className="fact"><div className="fact-value">{dayOfYear}</div><div className="fact-label">{L.t.dayOfYear}</div></div>
              <div className="fact"><div className="fact-value">{Math.max(0, daysLeft)}</div><div className="fact-label">{L.t.daysRemaining}</div></div>
            </div>
          </section>
          <section className="card">
            <h2 className="card-label">{L.t.browseWeeks}</h2>
            <div className="quick-links">
              {quickWeeks.map(w => (
                <Link key={w} href={`/${lang}/${year}/${w}`} className={`quick-link ${w === week ? 'current' : ''}`}>
                  {L.t.week} {w}
                </Link>
              ))}
              <Link href={`/${lang}/calendario/${year}`} className="quick-link">{L.t.calendar} {year} →</Link>
            </div>
          </section>
        </div>
      </main>
      <Footer lang={lang as LangCode} year={year} />
    </>
  )
}
