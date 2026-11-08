import { formatMoney, formatStepLong } from '../../lib/format.js'
import TableScroll from '../ui/TableScroll.jsx'

// The numbers behind a revenue chart, as a real table.
// It is the fully accessible version of the chart: every value can be read without a mouse.
export default function SeriesTable({ points, size, currency }) {
  return (
    <TableScroll label="Revenue data">
      <table className="table table--compact">
        <caption className="sr-only">Revenue by {size}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            <th scope="col" className="num">
              Revenue
            </th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.date}>
              <td>{formatStepLong(point.date, size)}</td>
              <td className="num">{formatMoney(point.revenue, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  )
}
