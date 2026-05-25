// PURE SERVER COMPONENT — no 'use client'
import Link from 'next/link'
import { getWeekRange, getISOWeek } from '@/lib/weeks'
import { LangCode, LANGS } from '@/lib/i18n'
import { fetchHolidays, Holiday } from '@/lib/holidays'
import { toLocalISODate } from '@/lib/dateUtils'

type Props = {
  lang: LangCode
  week: number
  year: number
  today: string        // YYYY-MM-DD local date
  countryCode?: string
}

export default async function MiniCal({ lang, week, year, today, countryCode }: Props) {
  const L = LANGS[lang]
  const { start: wStart, end: wEnd } = getWeekRange(week, year)
  const month = wStart.getMonth()
  const calYear = wStart.getFullYear()
  const country = countryCode ?? L.countries[0].code
  const countryName = L.countries.find(c => c.code === country)?.name ?? L.countries[0].name

  const holidays = await fetchHolidays(country, calYear)

  // Build holiday map using LOCAL date strings (no timezone conversion)
  const holidayMap: Record<string, string[]> = {}
  holidays.forEach((h: Holiday) => {
    // h.date is already 'YYYY-MM-DD' from the API — use directly
    if (!holidayMap[h.date]) holidayMap[h.date] = []
    holidayMap[h.date].push(h.localName)
  })

  // Week range as local ISO strings
  const wStartStr = toLocalISODate(wStart)
  const wEndStr = toLocalISODate(wEnd)

  const firstDay = new Date(calYear, month, 1)
  const lastDay = new Date(calYear, month + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7 // Monday=0

  const cells: React.ReactNode[] = []

  // Day-of-week headers
  L.daysShort.forEach(d => (
    cells.push(<div key={`h-${d}`} className="cal-dow">{d}</div>)
  ))

  // Empty cells before month start
  for (let i = 0; i < startDow; i++) {
    cells.push(<div key={`e-${i}`} className="cal-day other-month" />)
  }

  // Days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(calYear, month, d)  // local midnight — no timezone issue
    const dow = (date.getDay() + 6) % 7
    const dateStr = toLocalISODate(date)       // 'YYYY-MM-DD' without UTC conversion
    const isToday = dateStr === today
    const inWeek = dateStr >= wStartStr && dateStr <= wEndStr
    const isWeekend = dow >= 5
    const dayHolidays = holidayMap[dateStr] || []
    const hasHoliday = dayHolidays.length > 0
    const { week: dayWeek, year: dayYear } = getISOWeek(date)
    const monthName = L.months[date.getMonth()]

    let cls = 'cal-day'
    if (isToday) cls += ' today'
    else if (inWeek) cls += ' in-week'
    if (isWeekend) cls += ' weekend'

    if (!hasHoliday) {
      cells.push(
        <div key={`d-${d}`} className={cls}>
          <Link href={`/${lang}/${dayYear}/${dayWeek}`} style={{ color: 'inherit', display: 'block' }}>
            {d}
          </Link>
        </div>
      )
    } else {
      cells.push(
        <div key={`d-${d}`} className={cls} style={{ position: 'relative' }}>
          <details style={{ display: 'contents' }}>
            <summary style={{ listStyle: 'none', cursor: 'pointer', display: 'block', position: 'relative' }}>
              {d}
              <span style={{
                position: 'absolute', bottom: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: 3, height: 3, borderRadius: '50%',
                background: 'var(--accent)', display: 'block',
              }} />
            </summary>
            <div style={{
              position: 'absolute',
              bottom: '110%',
              left: dow >= 5 ? 'auto' : '50%',
              right: dow >= 5 ? 0 : 'auto',
              transform: dow >= 5 ? 'none' : 'translateX(-50%)',
              background: 'var(--bg2)',
              border: '1px solid var(--accent)',
              borderRadius: 6,
              padding: '10px 12px',
              minWidth: 180,
              maxWidth: 240,
              zIndex: 50,
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                {d} {monthName} {dayYear} · {countryName}
              </p>
              {dayHolidays.map(name => (
                <p key={name} style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 4 }}>★ {name}</p>
              ))}
              <Link
                href={`/${lang}/${dayYear}/${dayWeek}`}
                style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', display: 'block', marginTop: 6 }}
              >
                → {L.t.week} {dayWeek}
              </Link>
            </div>
          </details>
        </div>
      )
    }
  }

  return (
    <div>
      <p className="card-label">{L.months[month].toUpperCase()} {calYear}</p>
      <div className="mini-cal" style={{ position: 'relative' }}>{cells}</div>
    </div>
  )
}
