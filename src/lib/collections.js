// Small general helpers for lists. They know nothing about orders,
// so they can group anything: orders by channel, products by category, and so on.

// Adds up a value for each group, e.g. revenue per category. Returns a Map: key -> total.
export function sumBy(items, getKey, getValue) {
  const totals = new Map()
  for (const item of items) {
    const key = getKey(item)
    totals.set(key, (totals.get(key) ?? 0) + getValue(item))
  }
  return totals
}

// Splits a list into groups. Returns a Map: key -> list of items.
export function groupBy(items, getKey) {
  const groups = new Map()
  for (const item of items) {
    const key = getKey(item)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(item)
  }
  return groups
}
