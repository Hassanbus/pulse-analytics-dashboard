import { describe, expect, it } from 'vitest'
import { addDays, daysBetween, isIsoDate, startOfMonth, toDate, toIso } from './dates.js'

describe('toDate and toIso', () => {
  it('convert in both directions without changing the day', () => {
    expect(toIso(toDate('2026-10-31'))).toBe('2026-10-31')
    expect(toDate('2026-01-01').toISOString()).toBe('2026-01-01T00:00:00.000Z')
  })
})

describe('addDays', () => {
  it('moves across months and years', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2025-12-31', 1)).toBe('2026-01-01')
  })

  it('goes back in time with negative numbers', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(addDays('2026-10-31', -364)).toBe('2025-11-01')
  })
})

describe('daysBetween', () => {
  it('counts whole days', () => {
    expect(daysBetween('2026-01-01', '2026-01-03')).toBe(2)
    expect(daysBetween('2025-11-01', '2026-10-31')).toBe(364)
    expect(daysBetween('2026-01-03', '2026-01-01')).toBe(-2)
  })
})

describe('startOfMonth', () => {
  it('returns the first day of the month', () => {
    expect(startOfMonth('2026-10-17')).toBe('2026-10-01')
  })
})

describe('isIsoDate', () => {
  it('accepts real days', () => {
    expect(isIsoDate('2026-02-28')).toBe(true)
    expect(isIsoDate('2024-02-29')).toBe(true)
  })

  it('rejects days that do not exist and wrong formats', () => {
    expect(isIsoDate('2026-02-30')).toBe(false)
    expect(isIsoDate('2026-13-01')).toBe(false)
    expect(isIsoDate('2026-2-3')).toBe(false)
    expect(isIsoDate('hello')).toBe(false)
    expect(isIsoDate(null)).toBe(false)
  })
})
