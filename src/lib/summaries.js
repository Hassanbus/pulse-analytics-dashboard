import { formatMoney, formatPercent, formatStepLong } from './format.js'

// Short text versions of the charts. Screen readers read them, because a picture of a
// chart tells nothing to someone who cannot see it.

// "Revenue by day for 30 days, $41,327.50 in total. Highest: Oct 15, 2026, $2,104.00. ..."
export function describeSeries(points, size, currency) {
  if (points.length === 0) return 'No revenue in this period.'
  let total = 0
  let best = points[0]
  let worst = points[0]
  for (const point of points) {
    total += point.revenue
    if (point.revenue > best.revenue) best = point
    if (point.revenue < worst.revenue) worst = point
  }
  const steps = `${points.length} ${size}${points.length === 1 ? '' : 's'}`
  return (
    `Revenue by ${size} for ${steps}, ${formatMoney(total, currency)} in total. ` +
    `Highest: ${formatStepLong(best.date, size)}, ${formatMoney(best.revenue, currency)}. ` +
    `Lowest: ${formatStepLong(worst.date, size)}, ${formatMoney(worst.revenue, currency)}.`
  )
}

// "Website 1,234 orders (45.0%), Mobile app 890 orders (32.4%)." Every part with its share.
export function describeParts(rows, getLabel, getValue, formatValue) {
  const total = rows.reduce((sum, row) => sum + getValue(row), 0)
  if (total === 0) return 'No data in this period.'
  const parts = rows.map(
    (row) => `${getLabel(row)} ${formatValue(getValue(row))} (${formatPercent(getValue(row) / total)})`,
  )
  return `${parts.join(', ')}.`
}
