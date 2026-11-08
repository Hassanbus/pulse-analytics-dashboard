import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { formatMoney, formatMoneyShort, formatStep, formatStepLong } from '../../lib/format.js'
import ChartTooltip from './ChartTooltip.jsx'

// Revenue over time. There is only one series, so there is no legend: the card title names it.
// "responsive" makes the chart follow the width of its card.
// Animations are off: the numbers appear at once, and screenshots are stable.
export default function RevenueChart({ points, size, currency, title = 'Revenue over time' }) {
  return (
    <AreaChart
      responsive
      width="100%"
      height={280}
      data={points}
      margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
      title={title}
    >
      <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
      <XAxis
        dataKey="date"
        tickFormatter={(date) => formatStep(date, size)}
        tickLine={false}
        axisLine={{ stroke: 'var(--chart-axis)' }}
        minTickGap={24}
      />
      {/* "snap125" keeps axis steps round (like 10K, 20K, 30K), so the labels are easy to read. */}
      <YAxis
        tickFormatter={(value) => formatMoneyShort(value, currency)}
        niceTicks="snap125"
        tickLine={false}
        axisLine={false}
        width={64}
      />
      <Tooltip
        cursor={{ stroke: 'var(--chart-axis)' }}
        content={(props) => (
          <ChartTooltip
            {...props}
            formatLabel={(date) => formatStepLong(date, size)}
            formatValue={(value) => formatMoney(value, currency)}
          />
        )}
      />
      <Area
        type="monotone"
        dataKey="revenue"
        name="Revenue"
        stroke="var(--chart-1)"
        strokeWidth={2}
        fill="var(--chart-1)"
        fillOpacity={0.1}
        activeDot={{ r: 4, stroke: 'var(--surface)', strokeWidth: 2 }}
        isAnimationActive={false}
      />
    </AreaChart>
  )
}
