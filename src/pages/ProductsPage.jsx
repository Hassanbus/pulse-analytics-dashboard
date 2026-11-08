import { useMemo } from 'react'
import { useOutletContext } from 'react-router'
import ProductsTable from '../components/products/ProductsTable.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import PageSkeleton from '../components/ui/PageSkeleton.jsx'
import { orders, products } from '../data/dataset.js'
import { useDateRange } from '../hooks/useDateRange.js'
import { formatRange } from '../lib/format.js'
import { productRows } from '../lib/metrics.js'
import { useSettings } from '../settings/useSettings.js'
import '../components/products/products.css'

// All 40 products with units sold, revenue and a small trend chart for the chosen period.
export default function ProductsPage() {
  const { loading } = useOutletContext()
  const { range } = useDateRange()
  const { currency } = useSettings()
  const { start, end } = range

  const rows = useMemo(() => productRows(orders, products, { start, end }), [start, end])

  if (loading) return <PageSkeleton variant="table" />

  return (
    <div className="page">
      <PageHeader title="Products" description={`${products.length} products · ${formatRange(range)}`} />
      <section className="card" aria-label="Products table">
        <ProductsTable rows={rows} currency={currency} />
      </section>
    </div>
  )
}
