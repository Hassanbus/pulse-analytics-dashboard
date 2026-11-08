import { describe, expect, it } from 'vitest'
import * as m from './metrics.js'
import { octoberRange, sampleOrders, sampleProducts } from '../test/fixtures.js'

// ORD-1 to ORD-5 are inside Oct 1-4. Paid: ORD-1 (100), ORD-2 (50), ORD-4 (30) = 180.
const october = m.filterByRange(sampleOrders, octoberRange)

describe('isPaid', () => {
  it('counts completed and processing orders as paid', () => {
    expect(['completed', 'processing', 'refunded', 'cancelled'].map((status) => m.isPaid({ status })))
      .toEqual([true, true, false, false])
  })
})

describe('filterByRange', () => {
  it('keeps orders on the first and the last day', () => {
    expect(october.map((o) => o.id)).toEqual(['ORD-1', 'ORD-2', 'ORD-3', 'ORD-4', 'ORD-5'])
  })
})

describe('totalRevenue, averageOrderValue and refundRate', () => {
  it('only count paid orders as revenue', () => {
    expect(m.totalRevenue(october)).toBe(180)
    expect(m.averageOrderValue(october)).toBe(60)
  })

  it('divide refunded orders by all orders', () => {
    expect(m.refundRate(october)).toBe(0.2)
  })

  it('return 0 for an empty list instead of dividing by zero', () => {
    expect(m.totalRevenue([])).toBe(0)
    expect(m.averageOrderValue([])).toBe(0)
    expect(m.refundRate([])).toBe(0)
  })
})

describe('percentChange', () => {
  it('returns the relative change', () => {
    expect(m.percentChange(150, 100)).toBe(0.5)
    expect(m.percentChange(50, 100)).toBe(-0.5)
  })

  it('returns null when there is nothing to compare with', () => {
    expect(m.percentChange(5, 0)).toBeNull()
    expect(m.percentChange(5, null)).toBeNull()
  })
})

describe('summarize', () => {
  it('returns the four headline numbers', () => {
    expect(m.summarize(october)).toEqual({ revenue: 180, orders: 5, averageOrderValue: 60, refundRate: 0.2 })
  })
})

describe('kpis', () => {
  it('compares with the previous period of the same length (Sep 27-30: only ORD-6)', () => {
    const result = m.kpis(sampleOrders, octoberRange, '2026-01-01')
    expect(result.revenue).toEqual({ value: 180, change: 1.25 }) // 80 -> 180
    expect(result.orders).toEqual({ value: 5, change: 4 }) // 1 -> 5
    expect(result.averageOrderValue).toEqual({ value: 60, change: -0.25 }) // 80 -> 60
    expect(result.refundRate).toEqual({ value: 0.2, change: null }) // 0 before: no fair comparison
  })

  it('gives no change when the previous period starts before the data', () => {
    const result = m.kpis(sampleOrders, octoberRange, '2026-09-30')
    expect(result.revenue).toEqual({ value: 180, change: null })
  })
})

describe('ordersByChannel and revenueByCategory', () => {
  it('keep the given order and include groups with zero', () => {
    expect(m.ordersByChannel(october, ['Website', 'Mobile app', 'Marketplace', 'Social'])).toEqual([
      { channel: 'Website', orders: 3 },
      { channel: 'Mobile app', orders: 1 },
      { channel: 'Marketplace', orders: 0 },
      { channel: 'Social', orders: 1 },
    ])
    expect(m.revenueByCategory(october, ['Audio', 'Wearables', 'Smart Home'])).toEqual([
      { category: 'Audio', revenue: 130 },
      { category: 'Wearables', revenue: 50 },
      { category: 'Smart Home', revenue: 0 },
    ])
  })
})

describe('productTotals and topProducts', () => {
  it('sort products by paid revenue and count units', () => {
    expect(m.productTotals(october)).toEqual([
      { id: 'a', name: 'Alpha', units: 1, revenue: 100 },
      { id: 'b', name: 'Beta', units: 2, revenue: 50 },
      { id: 'c', name: 'Gamma', units: 3, revenue: 30 },
    ])
    expect(m.topProducts(october, 2).map((p) => p.id)).toEqual(['a', 'b'])
  })
})

describe('revenueSeries', () => {
  it('lists every day, also days without sales', () => {
    expect(m.revenueSeries(sampleOrders, octoberRange)).toEqual([
      { date: '2026-10-01', revenue: 150 },
      { date: '2026-10-02', revenue: 0 },
      { date: '2026-10-03', revenue: 30 },
      { date: '2026-10-04', revenue: 0 },
    ])
  })

  it('groups long ranges into weeks', () => {
    const points = m.revenueSeries(sampleOrders, { start: '2026-08-06', end: '2026-10-04' })
    expect(points).toHaveLength(9)
    expect(points.at(-1)).toEqual({ date: '2026-09-28', revenue: 260 }) // ORD-6 + ORD-1 + ORD-2 + ORD-4
  })
})

describe('productRows', () => {
  it('returns every product, best first, with sparkline values', () => {
    const rows = m.productRows(sampleOrders, sampleProducts, octoberRange)
    expect(rows.map((r) => [r.id, r.units, r.revenue])).toEqual([
      ['a', 1, 100], ['b', 2, 50], ['c', 3, 30], ['d', 0, 0],
    ])
    expect(rows[0].trend).toEqual([100, 0, 0, 0])
    expect(rows[3].trend).toEqual([0, 0, 0, 0])
  })
})

describe('trendDirection', () => {
  it('compares the second half with the first half', () => {
    expect(m.trendDirection([1, 1, 2, 2])).toBe('up')
    expect(m.trendDirection([2, 2, 1, 1])).toBe('down')
    expect(m.trendDirection([10, 10, 10, 10.2])).toBe('flat')
    expect(m.trendDirection([0, 0, 1, 1])).toBe('up')
    expect(m.trendDirection([0, 0, 0, 0])).toBe('flat')
  })
})
