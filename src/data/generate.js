import { CATALOG, CHANNELS, REGION_WEIGHTS, REGIONS } from './catalog.js'
import { createRandom, pickWeighted } from './random.js'
import { addDays, daysBetween, toDate } from '../lib/dates.js'

// The demo covers exactly 12 months. "Today" in the app is the last day of the data,
// so "Last 7 days" always has orders, even if you open the site years from now.
export const DATA_START = '2025-11-01'
export const DATA_END = '2026-10-31'
export const SEED = 20261031

// 'Aria Wireless Earbuds' -> 'aria-wireless-earbuds' (used in product page URLs).
export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Each product gets hidden "personality" numbers. They only shape the fake data;
// the app never shows them. It only shows numbers computed from the orders.
function buildProducts(random) {
  return CATALOG.map(([name, category, price]) => ({
    id: slugify(name),
    name,
    category,
    price,
    popularity: 0.4 + random() * 1.6, // some products sell up to 4x more than others
    trend: -0.6 + random() * 1.4, // below 0: the product sells less as the year goes on
    refundChance: 0.02 + random() * 0.07,
  }))
}

// How busy a day is: slow growth, busier weekends, a holiday peak and some noise.
function ordersPerDay(random, date, progress) {
  const weekday = toDate(date).getUTCDay() // 0 = Sunday, 6 = Saturday
  const month = Number(date.slice(5, 7))
  const growth = 1 + 0.45 * progress
  const weekend = weekday === 0 || weekday === 6 ? 1.2 : 1
  const season = month >= 11 ? 1.3 : month <= 2 ? 0.85 : 1
  const noise = 0.85 + random() * 0.3
  return Math.round(26 * growth * weekend * season * noise)
}

// New orders are often still "processing". After about a week they are finished.
function pickStatus(random, product, daysAgo) {
  if (random() < 0.7 - daysAgo * 0.12) return 'processing'
  const roll = random()
  if (roll < product.refundChance) return 'refunded'
  if (roll < product.refundChance + 0.035) return 'cancelled'
  return 'completed'
}

function makeOrder(random, number, date, product, progress, daysAgo) {
  const quantity = pickWeighted(random, [1, 2, 3], [82, 14, 4])
  const discount = pickWeighted(random, [0, 0.1, 0.2], [75, 18, 7])
  const mobileGrowth = 0.8 + 0.5 * progress // the mobile app wins customers during the year
  return {
    id: `ORD-${10000 + number}`,
    date,
    productId: product.id,
    product: product.name,
    category: product.category,
    region: pickWeighted(random, REGIONS, REGION_WEIGHTS),
    channel: pickWeighted(random, CHANNELS, [44, 31 * mobileGrowth, 15, 10]),
    quantity,
    // Round to cents, like a real price.
    amount: Math.round(product.price * quantity * (1 - discount) * 100) / 100,
    status: pickStatus(random, product, daysAgo),
  }
}

// Creates all products and orders. The same seed always gives exactly the same result.
export function generateData(seed = SEED) {
  const random = createRandom(seed)
  const products = buildProducts(random)
  const totalDays = daysBetween(DATA_START, DATA_END) + 1
  const orders = []

  for (let day = 0; day < totalDays; day++) {
    const date = addDays(DATA_START, day)
    const progress = day / (totalDays - 1) // 0 on the first day, 1 on the last day
    const weights = products.map((p) => p.popularity * (1 + p.trend * progress))
    const count = ordersPerDay(random, date, progress)
    for (let i = 0; i < count; i++) {
      const product = pickWeighted(random, products, weights)
      orders.push(makeOrder(random, orders.length + 1, date, product, progress, totalDays - 1 - day))
    }
  }

  // Only the public facts leave this file. The hidden "personality" numbers stay here.
  const publicProducts = products.map(({ id, name, category, price }) => ({ id, name, category, price }))
  return { products: publicProducts, orders }
}
