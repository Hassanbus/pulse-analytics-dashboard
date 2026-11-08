// A tiny, hand-made list of orders for tests. It is small on purpose:
// you can check every expected number in the tests with pen and paper.
const base = { region: 'Europe', quantity: 1 }

export const sampleOrders = [
  { ...base, id: 'ORD-1', date: '2026-10-01', productId: 'a', product: 'Alpha', category: 'Audio', channel: 'Website', amount: 100, status: 'completed' },
  { ...base, id: 'ORD-2', date: '2026-10-01', productId: 'b', product: 'Beta', category: 'Wearables', channel: 'Mobile app', quantity: 2, amount: 50, status: 'completed' },
  { ...base, id: 'ORD-3', date: '2026-10-02', productId: 'a', product: 'Alpha', category: 'Audio', channel: 'Website', region: 'Middle East', amount: 100, status: 'refunded' },
  { ...base, id: 'ORD-4', date: '2026-10-03', productId: 'c', product: 'Gamma', category: 'Audio', channel: 'Social', region: 'North America', quantity: 3, amount: 30, status: 'processing' },
  { ...base, id: 'ORD-5', date: '2026-10-04', productId: 'b', product: 'Beta', category: 'Wearables', channel: 'Website', amount: 20, status: 'cancelled' },
  { ...base, id: 'ORD-6', date: '2026-09-30', productId: 'a', product: 'Alpha', category: 'Audio', channel: 'Website', amount: 80, status: 'completed' },
]

// The four days from Oct 1 to Oct 4 contain ORD-1 to ORD-5.
export const octoberRange = { start: '2026-10-01', end: '2026-10-04' }

export const sampleProducts = [
  { id: 'a', name: 'Alpha', category: 'Audio', price: 100 },
  { id: 'b', name: 'Beta', category: 'Wearables', price: 25 },
  { id: 'c', name: 'Gamma', category: 'Audio', price: 10 },
  { id: 'd', name: 'Delta', category: 'Smart Home', price: 40 },
]
