import { useMemo } from 'react'
import { useOutletContext } from 'react-router'
import OrderFilters from '../components/orders/OrderFilters.jsx'
import OrdersTable from '../components/orders/OrdersTable.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Icon from '../components/ui/Icon.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import PageSkeleton from '../components/ui/PageSkeleton.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import { orders } from '../data/dataset.js'
import { useDateRange } from '../hooks/useDateRange.js'
import { useOrderFilters } from '../hooks/useOrderFilters.js'
import { ORDER_COLUMNS, csvFileName, downloadCsv, toCsv } from '../lib/csv.js'
import { formatNumber, formatRange } from '../lib/format.js'
import { filterByRange } from '../lib/metrics.js'
import { filterOrders, paginate, sortOrders } from '../lib/orderTable.js'
import { useSettings } from '../settings/useSettings.js'
import '../components/orders/orders.css'

// All orders of the period in a table: search, filters, sort, 20 rows per page and CSV export.
export default function OrdersPage() {
  const { loading } = useOutletContext()
  const { range } = useDateRange()
  const { currency } = useSettings()
  const table = useOrderFilters()
  const { start, end } = range
  const { query, status, region, channel, sort, direction } = table

  // Each step is remembered separately, so changing the page does not filter or sort again.
  const inRange = useMemo(() => filterByRange(orders, { start, end }), [start, end])
  const filtered = useMemo(
    () => filterOrders(inRange, { query, status, region, channel }),
    [inRange, query, status, region, channel],
  )
  const sorted = useMemo(() => sortOrders(filtered, sort, direction), [filtered, sort, direction])
  const page = paginate(sorted, table.page)

  if (loading) return <PageSkeleton variant="table" />

  // The export holds every filtered order (all pages), in the sorted order.
  function exportCsv() {
    downloadCsv(toCsv(sorted, ORDER_COLUMNS), csvFileName(range))
  }

  return (
    <div className="page">
      <PageHeader
        title="Orders"
        description={formatRange(range)}
        actions={
          <button type="button" className="button button--secondary" onClick={exportCsv} disabled={!page.total}>
            <Icon name="download" size={18} />
            Export CSV
          </button>
        }
      />
      <section className="card" aria-label="Orders table">
        <OrderFilters filters={table} />
        {/* role="status" makes screen readers announce the new count after each change. */}
        <p className="results-count" role="status">
          {page.total === 0
            ? 'No orders found'
            : `Showing ${formatNumber(page.from)}–${formatNumber(page.to)} of ${formatNumber(page.total)} orders`}
        </p>
        {page.total === 0 ? (
          <EmptyState icon="search" title="No orders match" message="Try another search, other filters or a longer date range.">
            {table.hasFilters && (
              <button type="button" className="button" onClick={table.clearFilters}>
                Clear filters
              </button>
            )}
          </EmptyState>
        ) : (
          <>
            <OrdersTable rows={page.rows} sort={sort} direction={direction} onSort={table.setSort} currency={currency} />
            <Pagination page={page.page} pageCount={page.pageCount} onChange={table.setPage} />
          </>
        )}
      </section>
    </div>
  )
}
