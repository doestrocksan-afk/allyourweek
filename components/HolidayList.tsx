// PURE SERVER COMPONENT — no 'use client'
import Link from 'next/link'
import { LangCode, LANGS } from '@/lib/i18n'
import { fetchHolidays, getHolidaysInRange, getUpcomingHolidays } from '@/lib/holidays'
import { getISOWeek } from '@/lib/weeks'
import { fromISODate } from '@/lib/dateUtils'

type Props = {
  lang: LangCode
  weekStart: string   // YYYY-MM-DD
  weekEnd: string     // YYYY-MM-DD
  year: number
  activeCountry?: string
  pageUrl: string
  isCurrentWeek?: boolean
}

const IN_COUNTRY: Record<LangCode, (c: string, d1: string, d2: string, cur: boolean) => string> = {
  en: (c, d1, d2, cur) => cur ? `Public holidays this week in ${c}` : `Public holidays ${d1}–${d2} in ${c}`,
  es: (c, d1, d2, cur) => cur ? `Festivos esta semana en ${c}` : `Festivos del ${d1} al ${d2} en ${c}`,
  de: (c, d1, d2, cur) => cur ? `Feiertage diese Woche in ${c}` : `Feiertage ${d1}–${d2} in ${c}`,
  fr: (c, d1, d2, cur) => cur ? `Jours fériés cette semaine en ${c}` : `Jours fériés du ${d1} au ${d2} en ${c}`,
  it: (c, d1, d2, cur) => cur ? `Festività questa settimana in ${c}` : `Festività dal ${d1} al ${d2} in ${c}`,
  pt: (c, d1, d2, cur) => cur ? `Feriados esta semana em ${c}` : `Feriados de ${d1} a ${d2} em ${c}`,
  pl: (c, d1, d2, cur) => cur ? `Święta w tym tygodniu w ${c}` : `Święta ${d1}–${d2} w ${c}`,
  nl: (c, d1, d2, cur) => cur ? `Feestdagen deze week in ${c}` : `Feestdagen ${d1}–${d2} in ${c}`,
  tr: (c, d1, d2, cur) => cur ? `Bu haftaki resmi tatiller — ${c}` : `${d1}–${d2} resmi tatiller — ${c}`,
  ro: (c, d1, d2, cur) => cur ? `Sărbători legale această săptămână în ${c}` : `Sărbători legale ${d1}–${d2} în ${c}`,
}

const HOLIDAY_CONTEXT: Record<LangCode, (day: string, month: string, year: number, country: string, name: string) => string> = {
  en: (d, m, y, c, n) => `On ${d} ${m} ${y} in ${c}: ${n}`,
  es: (d, m, y, c, n) => `El ${d} de ${m} de ${y} en ${c} cae ${n}`,
  de: (d, m, y, c, n) => `Am ${d}. ${m} ${y} in ${c}: ${n}`,
  fr: (d, m, y, c, n) => `Le ${d} ${m} ${y} en ${c}: ${n}`,
  it: (d, m, y, c, n) => `Il ${d} ${m} ${y} in ${c}: ${n}`,
  pt: (d, m, y, c, n) => `Em ${d} de ${m} de ${y} em ${c}: ${n}`,
  pl: (d, m, y, c, n) => `${d} ${m} ${y} w ${c}: ${n}`,
  nl: (d, m, y, c, n) => `Op ${d} ${m} ${y} in ${c}: ${n}`,
  tr: (d, m, y, c, n) => `${y} yılı ${m} ${d}'ında ${c}'da: ${n}`,
  ro: (d, m, y, c, n) => `Pe ${d} ${m} ${y} în ${c}: ${n}`,
}

const UPCOMING_LABEL: Record<LangCode, string> = {
  en: 'Next public holidays in', es: 'Próximos festivos en', de: 'Nächste Feiertage in',
  fr: 'Prochains jours fériés en', it: 'Prossime festività in', pt: 'Próximos feriados em',
  pl: 'Nadchodzące święta w', nl: 'Komende feestdagen in', tr: 'Yaklaşan tatiller —', ro: 'Următoarele sărbători în',
}

export default async function HolidayList({ lang, weekStart, weekEnd, year, activeCountry, pageUrl, isCurrentWeek }: Props) {
  const L = LANGS[lang]
  const countryConfig = L.countries.find(c => c.code === activeCountry) ?? L.countries[0]
  const countryCode = countryConfig.code
  const countryName = countryConfig.name

  const allHolidays = await fetchHolidays(countryCode, year)

  // Use fromISODate to parse dates in local time (avoids UTC timezone offset)
  const start = fromISODate(weekStart)
  const end = fromISODate(weekEnd)
  const inWeek = getHolidaysInRange(allHolidays, start, end)
  const showUpcoming = inWeek.length === 0
  const show = showUpcoming ? getUpcomingHolidays(allHolidays, start, 5) : inWeek

  // Date strings for H3
  const startDate = fromISODate(weekStart)
  const endDate = fromISODate(weekEnd)
  const d1 = `${startDate.getDate()} ${L.monthsShort[startDate.getMonth()]}`
  const d2 = `${endDate.getDate()} ${L.monthsShort[endDate.getMonth()]}`
  const cur = isCurrentWeek ?? false

  const noHolidaysThisWeek: Record<LangCode, string> = {
    en: `No public holidays in ${countryName} this week`,
    es: `No hay festivos en ${countryName} esta semana`,
    de: `Keine Feiertage in ${countryName} diese Woche`,
    fr: `Pas de jours fériés en ${countryName} cette semaine`,
    it: `Nessuna festività in ${countryName} questa settimana`,
    pt: `Sem feriados em ${countryName} esta semana`,
    pl: `Brak świąt w ${countryName} w tym tygodniu`,
    nl: `Geen feestdagen in ${countryName} deze week`,
    tr: `${countryName}'da bu hafta resmi tatil yok`,
    ro: `Nicio sărbătoare în ${countryName} această săptămână`,
  }

  const h3Text = showUpcoming
    ? `${noHolidaysThisWeek[lang]} — ${UPCOMING_LABEL[lang]} ${countryName}:`
    : IN_COUNTRY[lang](countryName, d1, d2, cur)

  return (
    <div>
      {L.countries.length > 1 && (
        <nav aria-label="Country selector" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {L.countries.map(c => {
            const isActive = c.code === countryCode
            return (
              <Link
                key={c.code}
                href={`${pageUrl}?pais=${c.code}`}
                className={`country-tab ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {c.name}
              </Link>
            )
          })}
        </nav>
      )}

      <h3 style={{
        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)',
        letterSpacing: 1, marginBottom: 14, fontWeight: 400, textTransform: 'uppercase',
      }}>
        {h3Text}
      </h3>

      {show.length === 0 ? (
        <p className="no-holidays">{L.t.noHolidays}</p>
      ) : (
        <div className="holiday-list">
          {show.map(h => {
            const d = fromISODate(h.date)  // parse in local time
            const dayNum = d.getDate()
            const monthName = L.months[d.getMonth()]
            const isThisWeek = h.date >= weekStart && h.date <= weekEnd
            const { week: hWeek, year: hYear } = getISOWeek(d)
            const contextText = HOLIDAY_CONTEXT[lang](String(dayNum), monthName, hYear, countryName, h.localName)

            return (
              <details key={`${h.date}-${h.localName}`} style={{ borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
                <summary style={{ display: 'flex', alignItems: 'center', gap: 14, listStyle: 'none', cursor: 'pointer' }}>
                  <span className="holiday-date">{dayNum} {L.monthsShort[d.getMonth()]}</span>
                  <span className="holiday-name" style={{ flex: 1 }}>{h.localName}</span>
                  {isThisWeek && <span className="holiday-this-week">✓</span>}
                  <span style={{ color: 'var(--muted)', fontSize: 11 }}>▾</span>
                </summary>
                <div style={{ paddingTop: 10, paddingLeft: 70 }}>
                  <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                    {contextText}
                  </p>
                  <Link
                    href={`/${lang}/${hYear}/${hWeek}`}
                    style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', display: 'inline-block', marginTop: 6 }}
                  >
                    → {L.t.week} {hWeek}, {hYear}
                  </Link>
                </div>
              </details>
            )
          })}
        </div>
      )}
    </div>
  )
}
