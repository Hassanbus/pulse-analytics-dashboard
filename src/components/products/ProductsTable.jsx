import { Link } from 'react-router'
import { useRangeSearch } from '../../hooks/useDateRange.js'
import { formatMoney, formatNumber } from '../../lib/format.js'
import { trendDirection } from '../../lib/metrics.js'
import Sparkline from '../charts/Sparkline.jsx'
import TableScroll from '../ui/TableScroll.jsx'
import TrendLabel from './TrendLabel.jsx'

// Every product with its sales in the period, best seller first.
// "rows" comes from productRows() in lib/metrics.js.
export default function ProductsTable({ rows, currency }) {
  const rangeSearch = useRangeSearch()
  return (
    <TableScroll label="Products">
      <table className="table products-table">
        <caption className="sr-only">All products, sorted by revenue</caption>
        <thead>
          <tr>
            <th scope="col" className="num">
              <span aria-hidden="true">#</span>
              <span className="sr-only">Rank</span>
            </th>
            <th scope="col">Product</th>
            <th scope="col" className="num">
              Units sold
            </th>
            <th scope="col" className="num">
              Revenue
            </th>
            <th scope="col">Revenue trend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td className="num">
                <span className="rank">{index + 1}</span>
              </td>
              <td className="product-cell">
                <Link to={{ pathname: `/products/${row.id}`, search: rangeSearch }}>{row.name}</Link>
                <span className="cell-sub">{row.category}</span>
              </td>
              <td className="num">{formatNumber(row.units)}</td>
              <td className="num">{formatMoney(row.revenue, currency, 0)}</td>
              <td>
                <div className="trend-cell">
                  <Sparkline values={row.trend} />
                  <TrendLabel direction={trendDirection(row.trend)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  )
}
