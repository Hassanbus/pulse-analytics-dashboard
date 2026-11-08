import { describe, expect, it } from 'vitest'
import { filterOrders, paginate, sortOrders } from './orderTable.js'
import { sampleOrders } from '../test/fixtures.js'

const ids = (list) => list.map((order) => order.id)

describe('filterOrders', () => {
  it('returns everything when no filter is set', () => {
    expect(filterOrders(sampleOrders, {})).toHaveLength(sampleOrders.length)
  })

  it('combines status, region and channel filters', () => {
    expect(ids(filterOrders(sampleOrders, { status: 'completed', channel: 'Website' }))).toEqual(['ORD-1', 'ORD-6'])
    expect(ids(filterOrders(sampleOrders, { region: 'Middle East' }))).toEqual(['ORD-3'])
  })

  it('searches the id and the product name, ignoring case and spaces', () => {
    expect(ids(filterOrders(sampleOrders, { query: '  beta ' }))).toEqual(['ORD-2', 'ORD-5'])
    expect(ids(filterOrders(sampleOrders, { query: 'ord-4' }))).toEqual(['ORD-4'])
    expect(filterOrders(sampleOrders, { query: 'nothing like this' })).toEqual([])
  })
})

describe('sortOrders', () => {
  it('sorts numbers and text in both directions', () => {
    expect(ids(sortOrders(sampleOrders, 'amount', 'desc')).slice(0, 2)).toEqual(['ORD-3', 'ORD-1'])
    // Three "Alpha" orders come first; the tie-break by id puts ORD-1 at the top.
    expect(ids(sortOrders(sampleOrders, 'product', 'asc')).slice(0, 4)).toEqual(['ORD-1', 'ORD-3', 'ORD-6', 'ORD-2'])
  })

  it('breaks ties with the id, in the same direction', () => {
    // ORD-1 and ORD-3 both cost 100.
    expect(ids(sortOrders(sampleOrders, 'amount', 'asc')).slice(-2)).toEqual(['ORD-1', 'ORD-3'])
    expect(ids(sortOrders(sampleOrders, 'date', 'desc'))).toEqual(['ORD-5', 'ORD-4', 'ORD-3', 'ORD-2', 'ORD-1', 'ORD-6'])
  })

  it('does not change the original list', () => {
    const before = ids(sampleOrders)
    sortOrders(sampleOrders, 'amount', 'asc')
    expect(ids(sampleOrders)).toEqual(before)
  })
})

describe('paginate', () => {
  const items = Array.from({ length: 45 }, (_, index) => index + 1)

  it('returns one page and the numbers for "Showing 21-40 of 45"', () => {
    const result = paginate(items, 2, 20)
    expect(result.rows).toEqual(items.slice(20, 40))
    expect(result).toMatchObject({ page: 2, pageCount: 3, from: 21, to: 40, total: 45 })
  })

  it('moves bad page numbers to the nearest real page', () => {
    expect(paginate(items, 99, 20).page).toBe(3)
    expect(paginate(items, 0, 20).page).toBe(1)
    expect(paginate(items, 'abc', 20).page).toBe(1)
  })

  it('handles an empty list', () => {
    expect(paginate([], 1, 20)).toEqual({ rows: [], page: 1, pageCount: 1, from: 0, to: 0, total: 0 })
  })
})
