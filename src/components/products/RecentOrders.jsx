import { formatDate, formatMoney } from '../../lib/format.js'
import StatusBadge from '../orders/StatusBadge.jsx'
import EmptyState from '../ui/EmptyState.jsx'

// The latest orders of one product, as a short list.
export default function RecentOrders({ orders, currency }) {
  if (orders.length === 0) {
    return <EmptyState title="No orders" message="This product has no orders in this period." />
  }
  return (
    <ul className="recent-orders">
      {orders.map((order) => (
        <li key={order.id} className="recent-orders__item">
          <span>
            {order.id}
            <span className="recent-orders__meta">
              {' '}
              · {formatDate(order.date)} · {order.region}
            </span>
          </span>
          <span className="recent-orders__amount">{formatMoney(order.amount, currency)}</span>
          <span className="recent-orders__meta">{order.channel}</span>
          <StatusBadge status={order.status} />
        </li>
      ))}
    </ul>
  )
}
