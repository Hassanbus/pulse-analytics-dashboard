// Dates in this app are plain strings like '2026-10-31' (ISO format, in UTC).
// Why strings? They sort and compare correctly ('2026-01-09' < '2026-01-10'),
// they are the same in every time zone, and they fit nicely in a URL.

const DAY_MS = 24 * 60 * 60 * 1000

// '2026-10-31' -> a Date at midnight UTC. The 'Z' means UTC, so the user's
// time zone can never move the date to the day before.
export function toDate(iso) {
  return new Date(`${iso}T00:00:00Z`)
}

// A Date -> '2026-10-31'
export function toIso(date) {
  return date.toISOString().slice(0, 10)
}

// addDays('2026-10-31', 1) === '2026-11-01'. Negative numbers go back in time.
export function addDays(iso, days) {
  return toIso(new Date(toDate(iso).getTime() + days * DAY_MS))
}

// Whole days from a to b: daysBetween('2026-01-01', '2026-01-03') === 2
export function daysBetween(a, b) {
  return Math.round((toDate(b) - toDate(a)) / DAY_MS)
}

// '2026-10-17' -> '2026-10-01'
export function startOfMonth(iso) {
  return `${iso.slice(0, 7)}-01`
}

// True only for real calendar days written as 'YYYY-MM-DD'.
// We need this because values in the URL can be anything a person types.
export function isIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = toDate(value)
  // '2026-02-30' is not a real day: it fails here or turns into another date.
  return !Number.isNaN(date.getTime()) && toIso(date) === value
}
