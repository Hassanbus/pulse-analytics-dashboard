import { describe, expect, it } from 'vitest'
import * as f from './format.js'

describe('money', () => {
  it('formats full amounts with the chosen currency symbol', () => {
    expect(f.formatMoney(1234.5)).toBe('$1,234.50')
    expect(f.formatMoney(10, 'EUR')).toBe('€10.00')
    expect(f.formatMoney(10, 'EGP')).toContain('EGP')
    expect(f.formatMoney(1234.5, 'USD', 0)).toBe('$1,235')
  })

  it('formats short amounts for cards and axes', () => {
    expect(f.formatMoneyShort(412834)).toBe('$412.8K')
    expect(f.formatMoneyShort(1500000)).toBe('$1.5M')
    expect(f.formatMoneyShort(950)).toBe('$950')
  })
})

describe('numbers and percents', () => {
  it('rounds counts and shows one decimal for percents', () => {
    expect(f.formatNumber(12345.6)).toBe('12,346')
    expect(f.formatPercent(0.053)).toBe('5.3%')
  })

  it('always shows the sign of a change, except for zero', () => {
    expect(f.formatChange(0.123)).toBe('+12.3%')
    expect(f.formatChange(-0.04)).toBe('-4.0%')
    expect(f.formatChange(0)).toBe('0.0%')
  })
})

describe('dates', () => {
  it('formats a single day and a range in UTC', () => {
    expect(f.formatDate('2026-10-31')).toBe('Oct 31, 2026')
    expect(f.formatRange({ start: '2026-10-02', end: '2026-10-31' })).toMatch(/^Oct 2\s–\s31, 2026$/)
  })

  it('formats chart steps for axes and for tooltips', () => {
    expect(f.formatStep('2026-10-05', 'day')).toBe('Oct 5')
    expect(f.formatStep('2026-10-01', 'month')).toBe('Oct')
    expect(f.formatStepLong('2026-10-05', 'day')).toBe('Oct 5, 2026')
    expect(f.formatStepLong('2026-10-05', 'week')).toBe('Week of Oct 5, 2026')
    expect(f.formatStepLong('2026-10-01', 'month')).toBe('October 2026')
  })
})
