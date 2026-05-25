export function getISOWeek(date: Date): { week: number; year: number } {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  const week = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  return { week, year: d.getFullYear() }
}

export function getWeekRange(week: number, year: number): { start: Date; end: Date } {
  const jan4 = new Date(year, 0, 4)
  const start = new Date(jan4)
  start.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (week - 1) * 7)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export function getWeeksInYear(year: number): number {
  const dec28 = new Date(year, 11, 28)
  return getISOWeek(dec28).week
}

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / 86400000)
}

// Easter calculation (Butcher's algorithm)
export function getEaster(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month, day)
}

export function getSpecialDates(year: number) {
  const easter = getEaster(year)
  const carnival = new Date(easter)
  carnival.setDate(easter.getDate() - 47)
  const goodFriday = new Date(easter)
  goodFriday.setDate(easter.getDate() - 2)
  const ascension = new Date(easter)
  ascension.setDate(easter.getDate() + 39)
  const pentecost = new Date(easter)
  pentecost.setDate(easter.getDate() + 49)
  return { easter, carnival, goodFriday, ascension, pentecost }
}

export function getAllWeeks(year: number) {
  const total = getWeeksInYear(year)
  return Array.from({ length: total }, (_, i) => i + 1)
}
