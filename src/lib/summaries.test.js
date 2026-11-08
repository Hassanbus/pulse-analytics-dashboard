import { describe, expect, it } from 'vitest'
import { describeParts, describeSeries } from './summaries.js'

describe('describeSeries', () => {
  it('names the total, the highest and the lowest step', () => {
    const points = [
      { date: '2026-10-01', revenue: 150 },
      { date: '2026-10-02', revenue: 0 },
      { date: '2026-10-03', revenue: 30 },
    ]
    expect(describeSeries(points, 'day', 'USD')).toBe(
      'Revenue by day for 3 days, $180.00 in total. ' +
        'Highest: Oct 1, 2026, $150.00. Lowest: Oct 2, 2026, $0.00.',
    )
  })

  it('uses singular words for one step and handles an empty list', () => {
    expect(describeSeries([{ date: '2026-10-01', revenue: 5 }], 'month', 'USD')).toMatch(/^Revenue by month for 1 month,/)
    expect(describeSeries([], 'day', 'USD')).toBe('No revenue in this period.')
  })
})

describe('describeParts', () => {
  it('lists every part with its value and share', () => {
    const rows = [
      { channel: 'Website', orders: 3 },
      { channel: 'Social', orders: 1 },
    ]
    const text = describeParts(rows, (r) => r.channel, (r) => r.orders, (v) => `${v} orders`)
    expect(text).toBe('Website 3 orders (75.0%), Social 1 orders (25.0%).')
  })

  it('says there is no data when everything is zero', () => {
    expect(describeParts([{ v: 0 }], () => 'x', (r) => r.v, String)).toBe('No data in this period.')
  })
})
