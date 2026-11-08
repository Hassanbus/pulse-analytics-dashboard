import { Link } from 'react-router'
import { useRangeSearch } from '../../hooks/useDateRange.js'
import { formatMoney, formatNumber } from '../../lib/format.js'
import EmptyState from '../ui/EmptyState.jsx'
import TableScroll from '../ui/TableScroll.jsx'

// The best-selling products of the period. Each name links to its product page.
export default function TopProductsTable({ rows, currency }) {
  const rangeSearch = useRangeSearch()
  if (rows.length === 0) {
    return <EmptyState title="No sales yet" message="No products were sold in this period." />
  }
  return (
    <TableScroll label="Top products">
      <table className="table">
        <caption className="sr-only">Top {rows.length} products by revenue</caption>
        <thead>
          <tr>
            <th scope="col" className="num">
              <span aria-hidden="true">#</span>
              <span className="sr-only">Rank</span>
            </th>
            <th scope="col">Product</th>
            <th scope="col" className="num">
              Units
            </th>
            <th scope="col" className="num">
              Revenue
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td className="num">
                <span className="rank">{index + 1}</span>
              </td>
              <td>
                <Link to={{ pathname: `/products/${row.id}`, search: rangeSearch }}>{row.name}</Link>
              </td>
              <td className="num">{formatNumber(row.units)}</td>
              {/* Whole amounts are enough for a summary and keep the table narrow on phones. */}
              <td className="num">{formatMoney(row.revenue, currency, 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  )
}
