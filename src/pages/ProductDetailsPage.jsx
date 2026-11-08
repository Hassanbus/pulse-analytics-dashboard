import { useMemo } from 'react'
import { Link, useOutletContext, useParams } from 'react-router'
import KpiCards from '../components/kpi/KpiCards.jsx'
import ProductCharts from '../components/products/ProductCharts.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Icon from '../components/ui/Icon.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import PageSkeleton from '../components/ui/PageSkeleton.jsx'
import { CHANNELS } from '../data/catalog.js'
import { DATA_BOUNDS, orders, products } from '../data/dataset.js'
import { useDateRange, useRangeSearch } from '../hooks/useDateRange.js'
import { formatMoney, formatRange } from '../lib/format.js'
import * as metrics from '../lib/metrics.js'
import { sortOrders } from '../lib/orderTable.js'
import { bucketSize } from '../lib/ranges.js'
import { useSettings } from '../settings/useSettings.js'
import '../components/products/products.css'

// One product: its KPIs, its own revenue chart, its channels and its latest orders.
export default function ProductDetailsPage() {
  const { productId } = useParams() // the ":productId" part of the URL
  const { loading } = useOutletContext()
  const { range } = useDateRange()
  const { currency } = useSettings()
  const rangeSearch = useRangeSearch()
  const { start, end } = range
  const product = products.find((item) => item.id === productId)

  // The same pure functions as the Overview, but only with this product's orders.
  const data = useMemo(() => {
    const own = orders.filter((order) => order.productId === productId)
    const period = { start, end }
    const inRange = metrics.filterByRange(own, period)
    return {
      kpis: metrics.kpis(own, period, DATA_BOUNDS.start),
      series: metrics.revenueSeries(own, period),
      size: bucketSize(period),
      channels: metrics.ordersByChannel(inRange, CHANNELS),
      recent: sortOrders(inRange, 'date', 'desc').slice(0, 5),
    }
  }, [productId, start, end])

  if (loading) return <PageSkeleton />

  const backLink = (
    <Link className="back-link" to={{ pathname: '/products', search: rangeSearch }}>
      <Icon name="arrow-left" size={16} />
      All products
    </Link>
  )

  if (!product) {
    return (
      <div className="page">
        <title>Product not found · Pulse</title>
        {backLink}
        <EmptyState as="h1" icon="search" title="Product not found" message="This product does not exist in the demo store." />
      </div>
    )
  }

  // A link to the Orders page that already searches for this product.
  const ordersSearch = new URLSearchParams(rangeSearch)
  ordersSearch.set('q', product.name)

  return (
    <div className="page">
      {backLink}
      <PageHeader
        title={product.name}
        description={`${product.category} · ${formatMoney(product.price, currency)} · ${formatRange(range)}`}
        actions={
          <Link className="button button--secondary" to={{ pathname: '/orders', search: `?${ordersSearch}` }}>
            View orders
          </Link>
        }
      />
      <KpiCards kpis={data.kpis} currency={currency} />
      {data.kpis.orders.value === 0 ? (
        <EmptyState title="No orders in this period" message="Choose a longer date range to see this product's sales." />
      ) : (
        <ProductCharts data={data} product={product} currency={currency} />
      )}
    </div>
  )
}
