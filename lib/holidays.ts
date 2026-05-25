export type Holiday = {
  date: string
  localName: string
  name: string
  countryCode: string
  fixed: boolean
  global: boolean
  types: string[]
}

const cache: Record<string, Holiday[]> = {}

export async function fetchHolidays(country: string, year: number): Promise<Holiday[]> {
  const key = `${country}-${year}`
  if (cache[key]) return cache[key]
  try {
    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`, {
      next: { revalidate: 86400 * 7 }
    })
    if (!res.ok) return []
    const data: Holiday[] = await res.json()
    cache[key] = data
    return data
  } catch {
    return []
  }
}

export function getHolidaysInRange(holidays: Holiday[], start: Date, end: Date): Holiday[] {
  const s = start.toISOString().slice(0, 10)
  const e = end.toISOString().slice(0, 10)
  return holidays.filter(h => h.date >= s && h.date <= e)
}

export function getUpcomingHolidays(holidays: Holiday[], from: Date, count = 5): Holiday[] {
  const f = from.toISOString().slice(0, 10)
  return holidays.filter(h => h.date >= f).slice(0, count)
}
