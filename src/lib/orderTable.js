// Pure helpers for the orders table: search and filter, sort, and cut into pages.

export const PAGE_SIZE = 20

// The columns you can sort by, and the direction of the first click on each:
// newest and biggest first for dates and money, A to Z for text.
export const SORTABLE = {
  id: 'desc',
  date: 'desc',
  product: 'asc',
  region: 'asc',
  channel: 'asc',
  status: 'asc',
  amount: 'desc',
}

// Keeps the orders that match the search text and every chosen filter.
// An empty filter means "all". The search looks at the order id and the product name.
export function filterOrders(orders, { query = '', status = '', region = '', channel = '' }) {
  const text = query.trim().toLowerCase()
  return orders.filter(
    (order) =>
      (!status || order.status === status) &&
      (!region || order.region === region) &&
      (!channel || order.channel === channel) &&
      (!text || order.id.toLowerCase().includes(text) || order.product.toLowerCase().includes(text)),
  )
}

// Works for numbers and for text: -1 = a first, 1 = b first, 0 = equal.
function compare(a, b) {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

// Returns a sorted copy; the original list is never changed. Rows with the same value
// are sorted by id too, so the order is always the same and rows never jump between pages.
export function sortOrders(orders, key = 'date', direction = 'desc') {
  const sign = direction === 'asc' ? 1 : -1
  return [...orders].sort((a, b) => sign * (compare(a[key], b[key]) || compare(a.id, b.id)))
}

// Cuts one page out of the list. Pages start at 1.
// A page number that is too big (or not a number) becomes the nearest real page.
export function paginate(items, page, size = PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / size))
  const current = Math.min(Math.max(1, Math.floor(Number(page)) || 1), pageCount)
  const start = (current - 1) * size
  return {
    rows: items.slice(start, start + size),
    page: current,
    pageCount,
    from: items.length === 0 ? 0 : start + 1,
    to: Math.min(start + size, items.length),
    total: items.length,
  }
}
