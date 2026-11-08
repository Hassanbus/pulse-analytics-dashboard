import { toDate } from './dates.js'

// All number and date formatting lives here, so every screen shows values the same way.
// We always use English and UTC, so a date never moves to another day in another time zone.

const LOCALE = 'en-US'
const formatters = new Map()

// Creating an Intl formatter is slow, so we keep each one after its first use.
function formatter(Type, options) {
  const key = Type.name + JSON.stringify(options)
  if (!formatters.has(key)) formatters.set(key, new Type(LOCALE, options))
  return formatters.get(key)
}

// 1234.5 -> '$1,234.50' (or '$1,235' with digits = 0).
// The currency only changes the symbol (display only, no conversion).
export function formatMoney(value, currency = 'USD', digits = 2) {
  const options = { style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits }
  return formatter(Intl.NumberFormat, options).format(value)
}

// Short money for KPI cards and chart axes: '$412.8K', '$1.5M'
export function formatMoneyShort(value, currency = 'USD') {
  const options = { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1 }
  return formatter(Intl.NumberFormat, options).format(value)
}

// 12345.6 -> '12,346'
export function formatNumber(value) {
  return formatter(Intl.NumberFormat, { maximumFractionDigits: 0 }).format(value)
}

// 0.053 -> '5.3%'
export function formatPercent(value) {
  const options = { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }
  return formatter(Intl.NumberFormat, options).format(value)
}

// 0.123 -> '+12.3%'. The sign shows the direction, so color is never the only clue.
export function formatChange(value) {
  const options = { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: 'exceptZero' }
  return formatter(Intl.NumberFormat, options).format(value)
}

const FULL_DATE = { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' }

// '2026-10-31' -> 'Oct 31, 2026'
export function formatDate(iso) {
  return formatter(Intl.DateTimeFormat, FULL_DATE).format(toDate(iso))
}

// { start: '2026-10-02', end: '2026-10-31' } -> 'Oct 2 – 31, 2026'
export function formatRange({ start, end }) {
  return formatter(Intl.DateTimeFormat, FULL_DATE).formatRange(toDate(start), toDate(end))
}

// Short labels for chart axes: 'Oct 5' for days and weeks, 'Oct' for months.
export function formatStep(iso, size) {
  const options =
    size === 'month' ? { timeZone: 'UTC', month: 'short' } : { timeZone: 'UTC', month: 'short', day: 'numeric' }
  return formatter(Intl.DateTimeFormat, options).format(toDate(iso))
}

// Long labels for tooltips and tables: 'Oct 5, 2026', 'Week of Oct 5, 2026', 'October 2026'.
export function formatStepLong(iso, size) {
  if (size === 'month') {
    return formatter(Intl.DateTimeFormat, { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(toDate(iso))
  }
  return size === 'week' ? `Week of ${formatDate(iso)}` : formatDate(iso)
}
