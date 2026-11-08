import { Bar, BarChart, LabelList, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNumber } from '../../lib/format.js'
import ChartTooltip from './ChartTooltip.jsx'

// Orders per sales channel as horizontal bars: long names fit on small screens,
// and each value is written at the end of its bar, so nobody has to hover to read it.
// It is one measure, so every bar has the same color.
export default function ChannelChart({ rows }) {
  return (
    <BarChart
      responsive
      width="100%"
      height={rows.length * 44 + 8}
      data={rows}
      layout="vertical"
      margin={{ top: 4, right: 56, bottom: 4, left: 0 }}
      title="Orders by channel"
    >
      <XAxis type="number" hide />
      <YAxis
        type="category"
        dataKey="channel"
        width={96}
        tickLine={false}
        axisLine={{ stroke: 'var(--chart-axis)' }}
      />
      <Tooltip
        cursor={{ fill: 'var(--surface-2)' }}
        content={(props) => <ChartTooltip {...props} formatValue={formatNumber} />}
      />
      {/* Thin bars (20px) with a rounded end; the end at the axis stays square. */}
      <Bar
        dataKey="orders"
        name="Orders"
        fill="var(--chart-1)"
        barSize={20}
        radius={[0, 4, 4, 0]}
        isAnimationActive={false}
      >
        <LabelList dataKey="orders" position="right" formatter={formatNumber} className="chart-value" />
      </Bar>
    </BarChart>
  )
}
