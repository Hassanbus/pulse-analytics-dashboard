import { describe, expect, it } from 'vitest'
import {
  bucketSize,
  bucketStart,
  chartBuckets,
  clampDate,
  previousRange,
  rangeLength,
  resolveRange,
} from './ranges.js'

const bounds = { start: '2025-11-01', end: '2026-10-31' }

describe('resolveRange', () => {
  it('turns a preset into start and end days that end on the last data day', () => {
    expect(resolveRange({ range: '7d' }, bounds)).toEqual({ preset: '7d', start: '2026-10-25', end: '2026-10-31' })
    expect(resolveRange({ range: '12m' }, bounds)).toEqual({ preset: '12m', start: '2025-11-01', end: '2026-10-31' })
  })

  it('falls back to the last 30 days for missing or unknown values', () => {
    const fallback = { preset: '30d', start: '2026-10-02', end: '2026-10-31' }
    expect(resolveRange({}, bounds)).toEqual(fallback)
    expect(resolveRange({ range: 'forever' }, bounds)).toEqual(fallback)
    expect(resolveRange({ range: 'custom', from: 'bad', to: '2026-10-01' }, bounds)).toEqual(fallback)
  })

  it('accepts a custom range, swaps reversed dates and keeps it inside the data', () => {
    expect(resolveRange({ range: 'custom', from: '2026-01-10', to: '2026-02-10' }, bounds)).toEqual({
      preset: 'custom', start: '2026-01-10', end: '2026-02-10',
    })
    expect(resolveRange({ range: 'custom', from: '2026-02-10', to: '2026-01-10' }, bounds).start).toBe('2026-01-10')
    expect(resolveRange({ range: 'custom', from: '2020-01-01', to: '2030-01-01' }, bounds)).toEqual({
      preset: 'custom', ...bounds,
    })
  })
})

describe('clampDate', () => {
  it('moves dates outside the bounds to the nearest edge', () => {
    expect(clampDate('2020-05-05', bounds)).toBe('2025-11-01')
    expect(clampDate('2030-05-05', bounds)).toBe('2026-10-31')
    expect(clampDate('2026-05-05', bounds)).toBe('2026-05-05')
  })
})

describe('rangeLength and previousRange', () => {
  it('counts both the first and the last day', () => {
    expect(rangeLength({ start: '2026-10-25', end: '2026-10-31' })).toBe(7)
  })

  it('returns the period just before, with the same length', () => {
    expect(previousRange({ start: '2026-10-25', end: '2026-10-31' })).toEqual({ start: '2026-10-18', end: '2026-10-24' })
  })
})

describe('bucketSize', () => {
  it('uses days, weeks or months depending on the length', () => {
    expect(bucketSize({ start: '2026-10-01', end: '2026-10-31' })).toBe('day') // 31 days
    expect(bucketSize({ start: '2026-09-30', end: '2026-10-31' })).toBe('week') // 32 days
    expect(bucketSize({ start: '2026-07-04', end: '2026-10-31' })).toBe('week') // 120 days
    expect(bucketSize({ start: '2026-07-03', end: '2026-10-31' })).toBe('month') // 121 days
  })
})

describe('bucketStart', () => {
  const range = { start: '2026-08-06', end: '2026-10-04' }

  it('keeps days, finds the month start and counts weeks back from the end', () => {
    expect(bucketStart('2026-09-15', 'day', range)).toBe('2026-09-15')
    expect(bucketStart('2026-09-15', 'month', range)).toBe('2026-09-01')
    expect(bucketStart('2026-10-04', 'week', range)).toBe('2026-09-28')
    expect(bucketStart('2026-09-28', 'week', range)).toBe('2026-09-28')
    expect(bucketStart('2026-09-27', 'week', range)).toBe('2026-09-21')
  })

  it('never returns a day before the range start', () => {
    expect(bucketStart('2026-08-07', 'week', range)).toBe('2026-08-06')
    expect(bucketStart('2026-08-07', 'month', range)).toBe('2026-08-06')
  })
})

describe('chartBuckets', () => {
  it('lists every step of the range in order', () => {
    expect(chartBuckets({ start: '2026-10-25', end: '2026-10-31' }).starts).toHaveLength(7)
    const year = chartBuckets({ start: '2025-11-01', end: '2026-10-31' })
    expect(year.size).toBe('month')
    expect(year.starts).toHaveLength(12)
    expect(year.starts[0]).toBe('2025-11-01')
    const quarter = chartBuckets({ start: '2026-08-03', end: '2026-10-31' })
    expect(quarter.size).toBe('week')
    expect(quarter.starts).toHaveLength(13)
    expect(quarter.starts.slice(0, 2)).toEqual(['2026-08-03', '2026-08-09'])
  })
})
