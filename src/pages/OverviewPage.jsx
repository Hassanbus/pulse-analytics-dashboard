import { useMemo } from 'react'
import { useOutletContext } from 'react-router'
import CategoryChart from '../components/charts/CategoryChart.jsx'
import ChannelChart from '../components/charts/ChannelChart.jsx'
import ChartCard from '../components/charts/ChartCard.jsx'
import RevenueChart from '../components/charts/RevenueChart.jsx'
import SeriesTable from '../components/charts/SeriesTable.jsx'
import KpiCards from '../components/kpi/KpiCards.jsx'
import TopProductsTable from '../components/products/TopProductsTable.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import PageSkeleton from '../components/ui/PageSkeleton.jsx'
import { CATEGORIES, CHANNELS } from '../data/catalog.js'
import { DATA_BOUNDS, orders } from '../data/dataset.js'
import { useDateRange } from '../hooks/useDateRange.js'
import { formatMoney, formatNumber, formatRange } from '../lib/format.js'
import * as metrics from '../lib/metrics.js'
import { bucketSize } from '../lib/ranges.js'
import { describeParts, describeSeries } from '../lib/summaries.js'
import { useSettings } from '../settings/useSettings.js'

// The main dashboard: headline numbers, three charts and the best-selling products.
export default function OverviewPage() {
  const { loading } = useOutletContext()
  const { range } = useDateRange()
  const { currency } = useSettings()
  const { start, end } = range

  // All numbers come from pure functions. useMemo runs them again only when the dates change.
  const data = useMemo(() => {
    const period = { start, end }
    const inRange = metrics.filterByRange(orders, period)
    return {
      kpis: metrics.kpis(orders, period, DATA_BOUNDS.start),
      series: metrics.revenueSeries(orders, period),
      size: bucketSize(period),
      channels: metrics.ordersByChannel(inRange, CHANNELS),
      categories: metrics.revenueByCategory(inRange, CATEGORIES),
      top: metrics.topProducts(inRange, 5),
    }
  }, [start, end])

  if (loading) return <PageSkeleton />

  return (
    <div className="page">
      <PageHeader title="Overview" description={formatRange(range)} />
      <KpiCards kpis={data.kpis} currency={currency} />

      <ChartCard
        title="Revenue"
        subtitle={`Paid orders, per ${data.size}`}
        summary={describeSeries(data.series, data.size, currency)}
        table={<SeriesTable points={data.series} size={data.size} currency={currency} />}
      >
        <RevenueChart points={data.series} size={data.size} currency={currency} />
      </ChartCard>

      <div className="grid-2">
        <ChartCard
          title="Orders by channel"
          subtitle="All orders, including refunds"
          summary={describeParts(data.channels, (r) => r.channel, (r) => r.orders, (v) => `${formatNumber(v)} orders`)}
        >
          <ChannelChart rows={data.channels} />
        </ChartCard>
        <ChartCard
          title="Revenue by category"
          subtitle="Paid orders"
          summary={describeParts(data.categories, (r) => r.category, (r) => r.revenue, (v) => formatMoney(v, currency))}
        >
          <CategoryChart rows={data.categories} currency={currency} />
        </ChartCard>
      </div>

      <section className="card" aria-labelledby="top-products-title">
        <div className="card__header">
          <h2 id="top-products-title" className="card__title">
            Top 5 products
          </h2>
          <p className="card__subtitle">By revenue</p>
        </div>
        <TopProductsTable rows={data.top} currency={currency} />
      </section>
    </div>
  )
}
