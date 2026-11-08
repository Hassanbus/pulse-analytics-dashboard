import { Pie, PieChart, Tooltip } from 'recharts'
import { formatMoney, formatMoneyShort, formatPercent } from '../../lib/format.js'
import ChartTooltip from './ChartTooltip.jsx'
import './donut.css'

// Revenue per category as a donut. The legend lists every value and share in text,
// so the colors are never the only way to read the chart.
export default function CategoryChart({ rows, currency }) {
  const total = rows.reduce((sum, row) => sum + row.revenue, 0)
  // Each category keeps the color of its place in the fixed category list.
  // Recharts reads "fill" from each data item to paint its slice.
  const data = rows.map((row, index) => ({ ...row, fill: `var(--chart-${index + 1})` }))

  return (
    <div className="donut">
      <div className="donut__chart">
        <PieChart responsive width="100%" height={168} title="Revenue by category">
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatValue={(value) => formatMoney(value, currency)} />}
          />
          {/* The slice border in the card color makes the 2px gaps between slices. */}
          <Pie
            data={data}
            dataKey="revenue"
            nameKey="category"
            innerRadius="62%"
            outerRadius="95%"
            startAngle={90}
            endAngle={-270}
            stroke="var(--surface)"
            strokeWidth={2}
            isAnimationActive={false}
          />
        </PieChart>
        <p className="donut__total" aria-hidden="true">
          <span>Total</span>
          <strong>{formatMoneyShort(total, currency)}</strong>
        </p>
      </div>
      <ul className="legend">
        {data.map((row) => (
          <li key={row.category} className="legend__item">
            <span className="legend__swatch" style={{ background: row.fill }} />
            <span className="legend__name">{row.category}</span>
            <span className="legend__value">{formatMoneyShort(row.revenue, currency)}</span>
            <span className="legend__share">{formatPercent(total ? row.revenue / total : 0)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
