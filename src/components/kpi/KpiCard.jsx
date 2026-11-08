import ChangeBadge from './ChangeBadge.jsx'

// One headline number. <dt> and <dd> tell screen readers which label belongs to which value.
// A short value like "$41.3K" fits small screens; exactValue gives the full number to
// screen readers and to mouse users (as a tooltip).
export default function KpiCard({ label, value, exactValue, change, goodWhen }) {
  return (
    <div className="kpi-card">
      <dt className="kpi-card__label">{label}</dt>
      <dd className="kpi-card__value" title={exactValue}>
        {exactValue ? (
          <>
            <span aria-hidden="true">{value}</span>
            <span className="sr-only">{exactValue}</span>
          </>
        ) : (
          value
        )}
      </dd>
      <dd className="kpi-card__change">
        <ChangeBadge change={change} goodWhen={goodWhen} />
      </dd>
    </div>
  )
}
