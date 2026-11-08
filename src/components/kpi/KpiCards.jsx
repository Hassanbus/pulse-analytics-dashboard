import { useId } from 'react'
import { formatMoney, formatMoneyShort, formatNumber, formatPercent } from '../../lib/format.js'
import KpiCard from './KpiCard.jsx'
import './kpi.css'

// The four headline cards. The Overview and every product page use this same component.
// "kpis" comes from kpis() in lib/metrics.js: { revenue: { value, change }, ... }
export default function KpiCards({ kpis, currency }) {
  const headingId = useId()
  const { revenue, orders, averageOrderValue, refundRate } = kpis
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        Key metrics
      </h2>
      <dl className="kpi-grid">
        <KpiCard
          label="Revenue"
          value={formatMoneyShort(revenue.value, currency)}
          exactValue={formatMoney(revenue.value, currency)}
          change={revenue.change}
        />
        <KpiCard label="Orders" value={formatNumber(orders.value)} change={orders.change} />
        <KpiCard
          label="Average order value"
          value={formatMoney(averageOrderValue.value, currency)}
          change={averageOrderValue.change}
        />
        <KpiCard
          label="Refund rate"
          value={formatPercent(refundRate.value)}
          change={refundRate.change}
          goodWhen="down"
        />
      </dl>
    </section>
  )
}
