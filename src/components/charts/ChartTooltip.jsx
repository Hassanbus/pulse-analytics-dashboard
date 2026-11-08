// The small box that appears when you point at a chart, or move through it with the arrow keys.
// Recharts gives us "active", "payload" (the hovered values) and "label" (the x value).
// The value comes first and in bold, because that is what people look for.
export default function ChartTooltip({ active, payload, label, formatLabel, formatValue }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      {formatLabel && <p className="chart-tooltip__label">{formatLabel(label)}</p>}
      {payload.map((item) => (
        <p key={item.name} className="chart-tooltip__row">
          <span className="chart-tooltip__key" style={{ background: item.payload?.fill ?? item.color }} />
          <strong>{formatValue(item.value)}</strong>
          <span className="chart-tooltip__name">{item.name}</span>
        </p>
      ))}
    </div>
  )
}
