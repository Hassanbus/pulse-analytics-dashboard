import { Link } from 'react-router'
import { useRangeSearch } from '../../hooks/useDateRange.js'
import { formatDate, formatMoney } from '../../lib/format.js'
import SortableHeader from '../ui/SortableHeader.jsx'
import TableScroll from '../ui/TableScroll.jsx'
import StatusBadge from './StatusBadge.jsx'

const COLUMNS = [
  { key: 'id', label: 'Order' },
  { key: 'date', label: 'Date' },
  { key: 'product', label: 'Product' },
  { key: 'region', label: 'Region' },
  { key: 'channel', label: 'Channel' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount', numeric: true },
]

// One page of orders. The parent page does the filtering, sorting and paging;
// this component only shows the rows it gets.
export default function OrdersTable({ rows, sort, direction, onSort, currency }) {
  const rangeSearch = useRangeSearch()
  const sortedBy = COLUMNS.find((column) => column.key === sort).label
  return (
    <TableScroll label="Orders">
      <table className="table orders-table">
        <caption className="sr-only">
          Orders, sorted by {sortedBy}, {direction === 'asc' ? 'ascending' : 'descending'}
        </caption>
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <SortableHeader key={column.key} column={column} sort={sort} direction={direction} onSort={onSort} />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((order) => (
            <tr key={order.id}>
              <td className="muted nowrap">{order.id}</td>
              <td className="nowrap">{formatDate(order.date)}</td>
              <td>
                <Link to={{ pathname: `/products/${order.productId}`, search: rangeSearch }}>{order.product}</Link>
              </td>
              <td className="nowrap">{order.region}</td>
              <td className="nowrap">{order.channel}</td>
              <td>
                <StatusBadge status={order.status} />
              </td>
              <td className="num">{formatMoney(order.amount, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  )
}
