import { useState } from 'react'
import { DATA_BOUNDS } from '../../data/dataset.js'

// The "From" and "To" fields for a custom range. The dates are applied with a button,
// not on every key press, because a half-typed date (like the year "0002") is not a real range.
// min and max let the browser itself block dates outside the data or "To" before "From".
export default function CustomRangeForm({ range, onApply }) {
  const [from, setFrom] = useState(range.start)
  const [to, setTo] = useState(range.end)

  function handleSubmit(event) {
    event.preventDefault()
    onApply(from, to)
  }

  return (
    <form className="custom-range" onSubmit={handleSubmit} aria-label="Custom date range">
      <label className="custom-range__field">
        <span>From</span>
        <input
          className="input"
          type="date"
          value={from}
          min={DATA_BOUNDS.start}
          max={to || DATA_BOUNDS.end}
          required
          onChange={(event) => setFrom(event.target.value)}
        />
      </label>
      <label className="custom-range__field">
        <span>To</span>
        <input
          className="input"
          type="date"
          value={to}
          min={from || DATA_BOUNDS.start}
          max={DATA_BOUNDS.end}
          required
          onChange={(event) => setTo(event.target.value)}
        />
      </label>
      <button type="submit" className="button">
        Apply
      </button>
    </form>
  )
}
