import { useId } from 'react'
import './charts.css'

// A card for one chart: a title, the chart, a text summary for screen readers,
// and (optional) the numbers as a table that anyone can open.
export default function ChartCard({ title, subtitle, summary, table, children }) {
  const id = useId()
  return (
    <figure className="card chart-card" aria-labelledby={`${id}-title`}>
      <div className="card__header">
        <h2 id={`${id}-title`} className="card__title">
          {title}
        </h2>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
      </div>
      {children}
      <figcaption className="sr-only">{summary}</figcaption>
      {/* <details> is a built-in show/hide control: it works with the keyboard and needs no JavaScript. */}
      {table && (
        <details className="chart-card__data">
          <summary>Show data table</summary>
          {table}
        </details>
      )}
    </figure>
  )
}
