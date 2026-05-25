import { LangCode, LANGS } from '@/lib/i18n'

const BASE_URL = 'https://allyourweek.com'

type SchemaWeekProps = {
  lang: LangCode
  week: number
  year: number
  startDate: string
  endDate: string
}

type SchemaSpecialProps = {
  lang: LangCode
  name: string
  date: string
  year: number
  url: string
}

type SchemaCalendarProps = {
  lang: LangCode
  year: number
  country: string
}

type SchemaHolidaysProps = {
  lang: LangCode
  country: string
  year: number
  holidays: { date: string; name: string }[]
}

export function SchemaWeekPage({ lang, week, year, startDate, endDate }: SchemaWeekProps) {
  const L = LANGS[lang]
  const url = `${BASE_URL}/${lang}/${year}/${week}`
  const name = `${L.t.week} ${week}, ${year}`

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name,
        description: L.t.metaWeek(week, year,
          `${new Date(startDate).getDate()} ${L.months[new Date(startDate).getMonth()]} ${year}`,
          `${new Date(endDate).getDate()} ${L.months[new Date(endDate).getMonth()]} ${year}`
        ),
        inLanguage: L.hreflang,
        isPartOf: { '@id': BASE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'AllYourWeek.com', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: L.label, item: `${BASE_URL}/${lang}` },
          { '@type': 'ListItem', position: 3, name: String(year), item: `${BASE_URL}/${lang}/calendario/${year}` },
          { '@type': 'ListItem', position: 4, name: name, item: url },
        ],
      },
      {
        '@type': 'Event',
        name,
        startDate,
        endDate,
        description: name,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        location: { '@type': 'VirtualLocation', url },
        organizer: { '@type': 'Organization', name: 'AllYourWeek.com', url: BASE_URL },
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function SchemaSpecialDate({ lang, name, date, year, url }: SchemaSpecialProps) {
  const L = LANGS[lang]
  const d = new Date(date + 'T00:00:00')
  const dateStr = `${d.getDate()} ${L.months[d.getMonth()]} ${year}`

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}${url}`,
        url: `${BASE_URL}${url}`,
        name: `${name} ${year}`,
        description: `${name} ${year}: ${dateStr}`,
        inLanguage: L.hreflang,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'AllYourWeek.com', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: L.label, item: `${BASE_URL}/${lang}` },
          { '@type': 'ListItem', position: 3, name: `${name} ${year}`, item: `${BASE_URL}${url}` },
        ],
      },
      {
        '@type': 'Event',
        name: `${name} ${year}`,
        startDate: date,
        endDate: date,
        description: `${name} ${year}: ${dateStr}`,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function SchemaCalendarPage({ lang, year, country }: SchemaCalendarProps) {
  const L = LANGS[lang]
  const url = `${BASE_URL}/${lang}/calendario/${year}`

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: `${L.t.calendar} ${year} — ${country}`,
        inLanguage: L.hreflang,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'AllYourWeek.com', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: L.label, item: `${BASE_URL}/${lang}` },
          { '@type': 'ListItem', position: 3, name: `${L.t.calendar} ${year}`, item: url },
        ],
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function SchemaHolidaysPage({ lang, country, year, holidays }: SchemaHolidaysProps) {
  const L = LANGS[lang]
  const url = `${BASE_URL}/${lang}/festivos/${country}/${year}`

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: `${L.t.holidaysIn} ${country} ${year}`,
        inLanguage: L.hreflang,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'AllYourWeek.com', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: L.label, item: `${BASE_URL}/${lang}` },
          { '@type': 'ListItem', position: 3, name: `${L.t.holidays} ${year}`, item: url },
        ],
      },
      {
        '@type': 'ItemList',
        name: `${L.t.holidays} ${country} ${year}`,
        numberOfItems: holidays.length,
        itemListElement: holidays.map((h, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: h.name,
          item: {
            '@type': 'Event',
            name: h.name,
            startDate: h.date,
            endDate: h.date,
          },
        })),
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function SchemaHomePage({ lang }: { lang: LangCode }) {
  const L = LANGS[lang]
  const url = `${BASE_URL}/${lang}`

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': BASE_URL,
        url: BASE_URL,
        name: 'AllYourWeek.com',
        description: L.t.metaHome,
        inLanguage: L.hreflang,
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/${lang}/{week}` },
          'query-input': 'required name=week',
        },
      },
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: `${L.t.currentWeek} | AllYourWeek.com`,
        description: L.t.metaHome,
        inLanguage: L.hreflang,
        isPartOf: { '@id': BASE_URL },
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
