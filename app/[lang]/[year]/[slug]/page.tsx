import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SearchBox from '@/components/SearchBox'
import HolidayList from '@/components/HolidayList'
import MiniCal from '@/components/MiniCal'
import { SchemaWeekPage, SchemaSpecialDate } from '@/components/Schema'
import { LANGS, LangCode, LANG_CODES } from '@/lib/i18n'
import { getWeekRange, getWeeksInYear, getDayOfYear, getISOWeek } from '@/lib/weeks'
import { toLocalISODate } from '@/lib/dateUtils'
import { SPECIAL_SLUGS, SPECIAL_NAMES, SPECIAL_DESC, SPECIAL_KEYS, findSpecialKey, getSpecialDateForYear } from '@/lib/special'

const BASE_URL = 'https://allyourweek.com'
type Props = {
  params: Promise<{ lang: string; year: string; slug: string }>
  searchParams: Promise<{ pais?: string }>
}

export async function generateStaticParams() {
  const years = [2024, 2025, 2026, 2027, 2028]
  const params: { lang: string; year: string; slug: string }[] = []
  for (const lang of LANG_CODES) {
    for (const year of years) {
      const total = getWeeksInYear(year)
      for (let week = 1; week <= total; week++) {
        params.push({ lang, year: String(year), slug: String(week) })
      }
      for (const key of SPECIAL_KEYS) {
        params.push({ lang, year: String(year), slug: SPECIAL_SLUGS[key][lang as LangCode] })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, year, slug } = await params
  if (!LANG_CODES.includes(lang as LangCode)) return {}
  const L = LANGS[lang as LangCode]
  const y = parseInt(year)
  const weekNum = parseInt(slug)

  if (!isNaN(weekNum)) {
    const { start, end } = getWeekRange(weekNum, y)
    const startStr = `${start.getDate()} ${L.months[start.getMonth()]} ${y}`
    const endStr = `${end.getDate()} ${L.months[end.getMonth()]} ${y}`
    const rangeStr = `${start.getDate()} ${L.monthsShort[start.getMonth()]} – ${end.getDate()} ${L.monthsShort[end.getMonth()]} ${y}`
    const ogUrl = `${BASE_URL}/og?week=${weekNum}&year=${y}&label=${encodeURIComponent(L.t.week)}&range=${encodeURIComponent(rangeStr)}&type=week`
    return {
      title: `${L.t.week} ${weekNum}, ${y} | AllYourWeek.com`,
      description: L.t.metaWeek(weekNum, y, startStr, endStr),
      alternates: {
        canonical: `${BASE_URL}/${lang}/${y}/${weekNum}`,
        languages: Object.fromEntries(LANG_CODES.map(l => [LANGS[l].hreflang, `${BASE_URL}/${l}/${y}/${weekNum}`]))
      },
      openGraph: {
        title: `${L.t.week} ${weekNum}, ${y}`, description: rangeStr,
        url: `${BASE_URL}/${lang}/${y}/${weekNum}`, siteName: 'AllYourWeek.com',
        images: [{ url: ogUrl, width: 1200, height: 630 }], type: 'article',
      },
      twitter: { card: 'summary_large_image', images: [ogUrl] },
    }
  }

  const key = findSpecialKey(slug, lang as LangCode)
  if (key) {
    const name = SPECIAL_NAMES[key][lang as LangCode]
    const date = getSpecialDateForYear(key, y)
    const dateStr = `${date.getDate()} ${L.months[date.getMonth()]} ${y}`
    const ogUrl = `${BASE_URL}/og?week=${encodeURIComponent(name)}&year=${y}&label=${encodeURIComponent(dateStr)}&type=special`
    return {
      title: `${name} ${y} | AllYourWeek.com`,
      description: `${name} ${y}: ${dateStr}. ${SPECIAL_DESC[key][lang as LangCode]}`,
      alternates: {
        canonical: `${BASE_URL}/${lang}/${y}/${slug}`,
        languages: Object.fromEntries(LANG_CODES.map(l => [LANGS[l].hreflang, `${BASE_URL}/${l}/${y}/${SPECIAL_SLUGS[key][l as LangCode]}`]))
      },
      openGraph: {
        title: `${name} ${y}`, description: dateStr,
        url: `${BASE_URL}/${lang}/${y}/${slug}`, siteName: 'AllYourWeek.com',
        images: [{ url: ogUrl, width: 1200, height: 630 }], type: 'article',
      },
      twitter: { card: 'summary_large_image', images: [ogUrl] },
    }
  }
  return {}
}

export default async function SlugPage({ params, searchParams }: Props) {
  const { lang, year, slug } = await params
  const { pais } = await searchParams
  if (!LANG_CODES.includes(lang as LangCode)) notFound()
  const y = parseInt(year)
  if (isNaN(y) || y < 2000 || y > 2100) notFound()
  const L = LANGS[lang as LangCode]
  const today = toLocalISODate(new Date())
  const weekNum = parseInt(slug)
  const validCountry = L.countries.find(c => c.code === pais)?.code ?? L.countries[0].code

  const now = new Date()
  const currentWeek = getISOWeek(now).week
  const currentYear = getISOWeek(now).year

  // ── WEEK PAGE ──────────────────────────────────────────────
  if (!isNaN(weekNum)) {
    if (weekNum < 1 || weekNum > 53) notFound()
    const totalWeeks = getWeeksInYear(y)
    const { start, end } = getWeekRange(weekNum, y)
    const dayOfYear = getDayOfYear(start)
    const daysLeft = 365 - getDayOfYear(end)
    const startStr = toLocalISODate(start)
    const endStr = toLocalISODate(end)
    const rangeStr = `${L.days[(start.getDay() + 6) % 7]} ${start.getDate()} ${L.months[start.getMonth()]} – ${L.days[(end.getDay() + 6) % 7]} ${end.getDate()} ${L.months[end.getMonth()]}`
    const prevWeek = weekNum > 1 ? weekNum - 1 : null
    const nextWeek = weekNum < totalWeeks ? weekNum + 1 : null
    const pageUrl = `/${lang}/${y}/${weekNum}`

    return (
      <>
        <SchemaWeekPage lang={lang as LangCode} week={weekNum} year={y} startDate={startStr} endDate={endStr} />
        <Nav lang={lang as LangCode} />
        <main>
          <div className="hero">
            <p className="hero-label">{L.t.week} · {y}</p>
            <h1 className="hero-number">{weekNum}</h1>
            <div className="hero-divider" />
            <h2 className="hero-range">{rangeStr}</h2>
            <p className="hero-year">
              {prevWeek && <Link href={`/${lang}/${y}/${prevWeek}`} style={{ marginRight: 16, color: 'var(--muted)' }}>← {L.t.week} {prevWeek}</Link>}
              {nextWeek && <Link href={`/${lang}/${y}/${nextWeek}`} style={{ color: 'var(--muted)' }}>{L.t.week} {nextWeek} →</Link>}
            </p>
          </div>
          <SearchBox lang={lang as LangCode} currentYear={new Date().getFullYear()} />
          <div className="page-content">
            <section className="card">
              <h2 className="card-label">{L.t.holidaysThisWeek}</h2>
              <HolidayList
                lang={lang as LangCode}
                weekStart={startStr}
                weekEnd={endStr}
                year={y}
                activeCountry={validCountry}
                pageUrl={pageUrl}
                isCurrentWeek={weekNum === currentWeek && y === currentYear}
              />
            </section>
            <section className="card">
              <MiniCal lang={lang as LangCode} week={weekNum} year={y} today={today} countryCode={validCountry} />
            </section>
            <section className="card">
              <h2 className="card-label">{L.t.weekAtAGlance}</h2>
              <div className="facts-grid">
                <div className="fact"><div className="fact-value">{weekNum}</div><div className="fact-label">{L.t.weekOf52.replace('52', String(totalWeeks))}</div></div>
                <div className="fact"><div className="fact-value">{Math.round(weekNum / totalWeeks * 100)}%</div><div className="fact-label">{L.t.yearDone}</div></div>
                <div className="fact"><div className="fact-value">{dayOfYear}</div><div className="fact-label">{L.t.dayOfYear}</div></div>
                <div className="fact"><div className="fact-value">{Math.max(0, daysLeft)}</div><div className="fact-label">{L.t.daysRemaining}</div></div>
              </div>
            </section>
            <section className="card">
              <h2 className="card-label">{L.t.browseWeeks}</h2>
              <div className="quick-links">
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(w => (
                  <Link key={w} href={`/${lang}/${y}/${w}`} className={`quick-link ${w === weekNum ? 'current' : ''}`}>{w}</Link>
                ))}
              </div>
            </section>
          </div>
        </main>
        <Footer lang={lang as LangCode} year={new Date().getFullYear()} />
      </>
    )
  }

  // ── SPECIAL DATE PAGE ──────────────────────────────────────
  const key = findSpecialKey(slug, lang as LangCode)
  if (!key) notFound()
  const name = SPECIAL_NAMES[key][lang as LangCode]
  const desc = SPECIAL_DESC[key][lang as LangCode]
  const date = getSpecialDateForYear(key, y)
  const { week, year: weekYear } = getISOWeek(date)
  const { start, end } = getWeekRange(week, weekYear)
  const dateStr = `${L.days[(date.getDay() + 6) % 7]}, ${date.getDate()} ${L.months[date.getMonth()]} ${y}`
  const weekRangeStr = `${start.getDate()} ${L.monthsShort[start.getMonth()]} – ${end.getDate()} ${L.monthsShort[end.getMonth()]}`
  const nearbyYears = [-3, -2, -1, 0, 1, 2, 3, 4].map(offset => {
    const yr = y + offset
    const d = getSpecialDateForYear(key, yr)
    const { week: w } = getISOWeek(d)
    return { yr, d, week: w }
  })
  const otherKeys = SPECIAL_KEYS.filter(k => k !== key)

  return (
    <>
      <SchemaSpecialDate lang={lang as LangCode} name={name} date={toLocalISODate(date)} year={y} url={`/${lang}/${y}/${slug}`} />
      <Nav lang={lang as LangCode} />
      <main>
        <div className="hero">
          <p className="hero-label">{y}</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 8vw, 72px)', color: 'var(--accent)', textAlign: 'center', padding: '0 24px', lineHeight: 1.1 }}>
            {name}
          </h1>
          <div className="hero-divider" />
          <h2 className="hero-range">{dateStr}</h2>
          <p className="hero-year">{L.t.week} {week} · {weekRangeStr}</p>
        </div>
        <div className="page-content">
          <section className="card">
            <h2 className="card-label">{name} {y}</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>{desc}</p>
            <div className="facts-grid">
              <div className="fact"><div className="fact-value">{date.getDate()}</div><div className="fact-label">{L.months[date.getMonth()]} {y}</div></div>
              <div className="fact"><div className="fact-value">{week}</div><div className="fact-label">{L.t.week}</div></div>
              <div className="fact"><div className="fact-value">{L.daysShort[(date.getDay() + 6) % 7]}</div><div className="fact-label">{L.days[(date.getDay() + 6) % 7]}</div></div>
              <div className="fact"><div className="fact-value">{date.getMonth() + 1}</div><div className="fact-label">{L.months[date.getMonth()]}</div></div>
            </div>
            <div style={{ marginTop: 16 }}>
              <Link href={`/${lang}/${weekYear}/${week}`} className="quick-link">→ {L.t.week} {week}, {weekYear}</Link>
            </div>
          </section>
          <section className="card">
            <h2 className="card-label">{name} — {nearbyYears[0].yr}–{nearbyYears[nearbyYears.length - 1].yr}</h2>
            <div className="holiday-list">
              {nearbyYears.map(({ yr, d, week: w }) => {
                const isCurrent = yr === y
                const ds = `${L.days[(d.getDay() + 6) % 7]}, ${d.getDate()} ${L.months[d.getMonth()]} ${yr}`
                return (
                  <div key={yr} className="holiday-item" style={{ borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
                    <span className="holiday-date" style={{ color: isCurrent ? 'var(--accent)' : 'var(--muted)' }}>{yr}</span>
                    <span className="holiday-name" style={{ color: isCurrent ? 'var(--accent)' : 'var(--text)', flex: 1 }}>
                      <Link href={`/${lang}/${yr}/${SPECIAL_SLUGS[key][lang as LangCode]}`} style={{ color: 'inherit' }}>{ds}</Link>
                    </span>
                    <Link href={`/${lang}/${yr}/${w}`} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>W{w}</Link>
                  </div>
                )
              })}
            </div>
          </section>
          <section className="card">
            <h2 className="card-label">{y}</h2>
            <div className="quick-links">
              {otherKeys.map(k => (
                <Link key={k} href={`/${lang}/${y}/${SPECIAL_SLUGS[k][lang as LangCode]}`} className="quick-link">
                  {SPECIAL_NAMES[k][lang as LangCode]}
                </Link>
              ))}
              <Link href={`/${lang}/calendario/${y}`} className="quick-link">{L.t.calendar} {y}</Link>
            </div>
          </section>
        </div>
      </main>
      <Footer lang={lang as LangCode} year={new Date().getFullYear()} />
    </>
  )
}
