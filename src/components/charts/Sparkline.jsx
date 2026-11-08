import { Line, LineChart, YAxis } from 'recharts'

// A tiny line chart with no axes: it only shows the shape of a trend.
// It is hidden from screen readers (aria-hidden), because the word next to it
// ("Rising", "Falling", "Steady") says the same thing in text.
export default function Sparkline({ values }) {
  const data = values.map((value, index) => ({ index, value }))
  return (
    <div className="sparkline" aria-hidden="true">
      {/* accessibilityLayer={false}: no keyboard stop, because there is nothing to explore here. */}
      <LineChart width={112} height={32} data={data} margin={{ top: 4, right: 2, bottom: 4, left: 2 }} accessibilityLayer={false}>
        {/* A hidden axis from the lowest to the highest value lets the line use the full height. */}
        <YAxis hide domain={['dataMin', 'dataMax']} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--chart-1)"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  )
}
