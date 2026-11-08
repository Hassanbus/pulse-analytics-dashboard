import { groupBy, sumBy } from './collections.js'
import { bucketStart, chartBuckets, previousRange } from './ranges.js'

// Pure functions that turn the orders into the numbers on screen. "Pure" means: the same
// input always gives the same output and nothing else changes, so every number is easy to test.

// Only these orders bring money in. Refunded and cancelled orders are not revenue.
const PAID_STATUSES = ['completed', 'processing']

export function isPaid(order) {
  return PAID_STATUSES.includes(order.status)
}

// Orders from the start day to the end day, both days included.
export function filterByRange(orders, { start, end }) {
  return orders.filter((order) => order.date >= start && order.date <= end)
}

export function totalRevenue(orders) {
  let sum = 0
  for (const order of orders) if (isPaid(order)) sum += order.amount
  return sum
}

// Average order value: revenue divided by the number of paid orders.
export function averageOrderValue(orders) {
  const paid = orders.filter(isPaid).length
  return paid === 0 ? 0 : totalRevenue(orders) / paid
}

// Share of all orders that were refunded (0.05 means 5%).
export function refundRate(orders) {
  if (orders.length === 0) return 0
  return orders.filter((order) => order.status === 'refunded').length / orders.length
}

// (now - before) / before. Returns null when there is nothing to compare with,
// so the screen can say "No earlier data" instead of a fake "+100%".
export function percentChange(current, previous) {
  if (previous === null || previous === undefined || previous === 0) return null
  return (current - previous) / previous
}

// The four headline numbers for a list of orders.
export function summarize(orders) {
  return {
    revenue: totalRevenue(orders),
    orders: orders.length,
    averageOrderValue: averageOrderValue(orders),
    refundRate: refundRate(orders),
  }
}

// KPI cards: each value in the range and its change against the previous period.
// When the previous period starts before our data, a comparison would be unfair: change = null.
export function kpis(orders, range, dataStart) {
  const current = summarize(filterByRange(orders, range))
  const before = previousRange(range)
  const previous = before.start >= dataStart ? summarize(filterByRange(orders, before)) : null
  const result = {}
  for (const key of Object.keys(current)) {
    const change = previous ? percentChange(current[key], previous[key]) : null
    result[key] = { value: current[key], change }
  }
  return result
}

// Orders per channel, in a fixed channel order, so bars never jump around.
export function ordersByChannel(orders, channels) {
  const counts = sumBy(orders, (order) => order.channel, () => 1)
  return channels.map((channel) => ({ channel, orders: counts.get(channel) ?? 0 }))
}

// Paid revenue per category, in a fixed category order, so each category keeps its color.
export function revenueByCategory(orders, categories) {
  const totals = sumBy(orders.filter(isPaid), (order) => order.category, (order) => order.amount)
  return categories.map((category) => ({ category, revenue: totals.get(category) ?? 0 }))
}

// Units sold and revenue per product, best sellers first. Only paid orders count.
export function productTotals(orders) {
  const rows = new Map()
  for (const order of orders) {
    if (!isPaid(order)) continue
    const row = rows.get(order.productId) ?? { id: order.productId, name: order.product, units: 0, revenue: 0 }
    row.units += order.quantity
    row.revenue += order.amount
    rows.set(order.productId, row)
  }
  return [...rows.values()].sort((a, b) => b.revenue - a.revenue)
}

export function topProducts(orders, limit = 5) {
  return productTotals(orders).slice(0, limit)
}

// Paid revenue for every chart step (day, week or month).
// Steps without sales get 0, so the line has no gaps.
export function revenueSeries(orders, range) {
  const { size, starts } = chartBuckets(range)
  const paid = filterByRange(orders, range).filter(isPaid)
  const totals = sumBy(paid, (order) => bucketStart(order.date, size, range), (order) => order.amount)
  return starts.map((date) => ({ date, revenue: totals.get(date) ?? 0 }))
}

// One row per product for the Products table: units, revenue and the values of its sparkline.
export function productRows(orders, products, range) {
  const { size, starts } = chartBuckets(range)
  const groups = groupBy(filterByRange(orders, range).filter(isPaid), (order) => order.productId)
  const rows = products.map((product) => {
    const own = groups.get(product.id) ?? []
    const perStep = sumBy(own, (order) => bucketStart(order.date, size, range), (order) => order.amount)
    return {
      ...product,
      units: own.reduce((sum, order) => sum + order.quantity, 0),
      revenue: totalRevenue(own),
      trend: starts.map((start) => perStep.get(start) ?? 0),
    }
  })
  return rows.sort((a, b) => b.revenue - a.revenue)
}

// Compares the second half of a series with the first half: 'up', 'down' or 'flat' (within 5%).
export function trendDirection(values) {
  const half = Math.floor(values.length / 2)
  const first = values.slice(0, half).reduce((sum, v) => sum + v, 0)
  const second = values.slice(values.length - half).reduce((sum, v) => sum + v, 0)
  const change = percentChange(second, first)
  if (change === null) return second > 0 ? 'up' : 'flat'
  if (change > 0.05) return 'up'
  if (change < -0.05) return 'down'
  return 'flat'
}
