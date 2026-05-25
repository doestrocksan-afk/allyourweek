/**
 * Converts a local Date to YYYY-MM-DD string WITHOUT timezone conversion.
 * toISOString() converts to UTC which causes off-by-one errors in UTC+ timezones.
 */
export function toLocalISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Creates a date from a YYYY-MM-DD string in local time (not UTC).
 * new Date('2026-05-30') parses as UTC midnight, causing timezone issues.
 */
export function fromISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}
