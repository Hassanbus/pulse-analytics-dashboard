import { describe, expect, it } from 'vitest'
import { CATEGORIES, CHANNELS, REGIONS, STATUSES } from './catalog.js'
import { DATA_END, DATA_START, generateData, slugify } from './generate.js'

const data = generateData()

describe('generateData', () => {
  it('creates exactly the same data for the same seed', () => {
    expect(generateData()).toEqual(data)
  })

  it('creates different orders for a different seed', () => {
    expect(generateData(1).orders).not.toEqual(data.orders)
  })

  it('has 40 products with unique ids in 5 categories', () => {
    expect(data.products).toHaveLength(40)
    expect(new Set(data.products.map((p) => p.id)).size).toBe(40)
    expect(new Set(data.products.map((p) => p.category))).toEqual(new Set(CATEGORIES))
  })

  it('has orders on every day of the 12 months', () => {
    const days = new Set(data.orders.map((o) => o.date))
    expect(days.size).toBe(365)
    expect(data.orders[0].date).toBe(DATA_START)
    expect(data.orders.at(-1).date).toBe(DATA_END)
  })

  it('uses all 5 regions, 4 channels and only known statuses', () => {
    expect(new Set(data.orders.map((o) => o.region))).toEqual(new Set(REGIONS))
    expect(new Set(data.orders.map((o) => o.channel))).toEqual(new Set(CHANNELS))
    expect(STATUSES).toEqual(expect.arrayContaining([...new Set(data.orders.map((o) => o.status))]))
  })

  it('creates orders with unique ids and positive amounts in cents', () => {
    expect(new Set(data.orders.map((o) => o.id)).size).toBe(data.orders.length)
    for (const order of data.orders) {
      expect(order.amount).toBeGreaterThan(0)
      expect(Math.round(order.amount * 100) / 100).toBe(order.amount)
    }
  })

  it('does not leak the hidden product settings', () => {
    expect(Object.keys(data.products[0])).toEqual(['id', 'name', 'category', 'price'])
  })
})

describe('slugify', () => {
  it('makes a URL-friendly id from a name', () => {
    expect(slugify('Aria Wireless Earbuds')).toBe('aria-wireless-earbuds')
    expect(slugify('Dock Pro USB-C Hub')).toBe('dock-pro-usb-c-hub')
    expect(slugify('  Hello, World!  ')).toBe('hello-world')
  })
})
