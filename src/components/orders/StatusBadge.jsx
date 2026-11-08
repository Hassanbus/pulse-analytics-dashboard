import { formatStatus } from '../../lib/format.js'

// The status of an order: a colored dot plus the word. The word is always there,
// so the meaning never depends on color alone.
export default function StatusBadge({ status }) {
  return (
    <span className={`status status--${status}`}>
      <span className="status__dot" aria-hidden="true" />
      {formatStatus(status)}
    </span>
  )
}
