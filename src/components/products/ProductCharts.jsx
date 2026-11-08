import { formatNumber } from '../../lib/format.js'
import { describeParts, describeSeries } from '../../lib/summaries.js'
import ChannelChart from '../charts/ChannelChart.jsx'
import ChartCard from '../charts/ChartCard.jsx'
import RevenueChart from '../charts/RevenueChart.jsx'
import SeriesTable from '../charts/SeriesTable.jsx'
import RecentOrders from './RecentOrders.jsx'

// The charts of one product page: its own revenue over time, its channels and its latest orders.
// "data" is calculated by ProductDetailsPage with the same pure functions as the Overview.
export default function ProductCharts({ data, product, currency }) {
  return (
    <>
      <ChartCard
        title="Revenue"
        subtitle={`Paid orders of this product, per ${data.size}`}
        summary={describeSeries(data.series, data.size, currency)}
        table={<SeriesTable points={data.series} size={data.size} currency={currency} />}
      >
        <RevenueChart points={data.series} size={data.size} currency={currency} title={`${product.name} revenue`} />
      </ChartCard>
      <div className="grid-2">
        <ChartCard
          title="Orders by channel"
          subtitle="All orders of this product"
          summary={describeParts(data.channels, (r) => r.channel, (r) => r.orders, (v) => `${formatNumber(v)} orders`)}
        >
          <ChannelChart rows={data.channels} />
        </ChartCard>
        <section className="card" aria-labelledby="recent-orders-title">
          <div className="card__header">
            <h2 id="recent-orders-title" className="card__title">
              Latest orders
            </h2>
          </div>
          <RecentOrders orders={data.recent} currency={currency} />
        </section>
      </div>
    </>
  )
}
