import { addDays, daysBetween, isIsoDate, startOfMonth } from './dates.js'

// The choices in the date range menu. "days" includes the last day itself.
export const PRESETS = [
  { id: '7d', label: 'Last 7 days', days: 7 },
  { id: '30d', label: 'Last 30 days', days: 30 },
  { id: '90d', label: 'Last 90 days', days: 90 },
  { id: '12m', label: 'Last 12 months', days: 365 },
  { id: 'custom', label: 'Custom range' },
]

export const DEFAULT_PRESET = '30d'

// Keeps a date inside the data bounds.
export function clampDate(iso, bounds) {
  if (iso < bounds.start) return bounds.start
  if (iso > bounds.end) return bounds.end
  return iso
}

// Turns the URL values into a safe { preset, start, end } object.
// Missing or broken values fall back to the default, so a bad link still shows a working page.
export function resolveRange({ range, from, to }, bounds) {
  if (range === 'custom' && isIsoDate(from) && isIsoDate(to)) {
    let start = clampDate(from, bounds)
    let end = clampDate(to, bounds)
    if (start > end) [start, end] = [end, start] // the dates were swapped: fix it quietly
    return { preset: 'custom', start, end }
  }
  const preset =
    PRESETS.find((p) => p.id === range && p.days) ?? PRESETS.find((p) => p.id === DEFAULT_PRESET)
  return { preset: preset.id, start: addDays(bounds.end, 1 - preset.days), end: bounds.end }
}

// Number of days in a range, counting the first and the last day.
export function rangeLength({ start, end }) {
  return daysBetween(start, end) + 1
}

// The period just before this one, with the same length. Used for "% change".
export function previousRange(range) {
  const length = rangeLength(range)
  return { start: addDays(range.start, -length), end: addDays(range.start, -1) }
}

// Charts group days into steps. 365 daily points would be too busy, so long ranges use bigger steps.
export function bucketSize(range) {
  const days = rangeLength(range)
  if (days <= 31) return 'day'
  if (days <= 120) return 'week'
  return 'month'
}

// The first day of the step that a date belongs to.
// Weeks are counted back from the end of the range, so the newest week is always complete.
export function bucketStart(iso, size, range) {
  if (size === 'day') return iso
  const start =
    size === 'month'
      ? startOfMonth(iso)
      : addDays(range.end, -6 - 7 * Math.floor(daysBetween(iso, range.end) / 7))
  return start < range.start ? range.start : start // the first step may be cut short by the range
}

// All steps of a range, in time order: { size: 'week', starts: ['2026-08-03', ...] }
export function chartBuckets(range) {
  const size = bucketSize(range)
  const starts = []
  for (let day = range.start; day <= range.end; day = addDays(day, 1)) {
    const start = bucketStart(day, size, range)
    if (starts.at(-1) !== start) starts.push(start)
  }
  return { size, starts }
}
