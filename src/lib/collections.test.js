import { describe, expect, it } from 'vitest'
import { groupBy, sumBy } from './collections.js'

const items = [
  { type: 'fruit', name: 'apple', price: 2 },
  { type: 'fruit', name: 'pear', price: 3 },
  { type: 'bread', name: 'bagel', price: 1 },
]

describe('sumBy', () => {
  it('adds up a value per key', () => {
    const totals = sumBy(items, (item) => item.type, (item) => item.price)
    expect([...totals]).toEqual([['fruit', 5], ['bread', 1]])
  })

  it('returns an empty Map for an empty list', () => {
    expect(sumBy([], () => 'x', () => 1).size).toBe(0)
  })
})

describe('groupBy', () => {
  it('collects the items of each key and keeps their order', () => {
    const groups = groupBy(items, (item) => item.type)
    expect(groups.get('fruit').map((item) => item.name)).toEqual(['apple', 'pear'])
    expect(groups.get('bread')).toHaveLength(1)
  })
})
