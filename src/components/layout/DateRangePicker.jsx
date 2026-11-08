import { useId } from 'react'
import { useDateRange } from '../../hooks/useDateRange.js'
import { PRESETS } from '../../lib/ranges.js'
import Icon from '../ui/Icon.jsx'
import CustomRangeForm from './CustomRangeForm.jsx'
import './range-picker.css'

// The global date range control. A native <select> works well with a keyboard,
// on phones and with screen readers, so we do not need a custom dropdown.
export default function DateRangePicker() {
  const { range, selectPreset, selectCustom } = useDateRange()
  const selectId = useId()

  return (
    <div className="range-picker">
      <div className="range-picker__preset">
        <Icon name="calendar" size={18} className="range-picker__icon" />
        <label className="sr-only" htmlFor={selectId}>
          Date range
        </label>
        <select
          id={selectId}
          className="select"
          value={range.preset}
          onChange={(event) => selectPreset(event.target.value)}
        >
          {PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>
      {/* The key creates a fresh form when the range changes, so its fields show the new dates. */}
      {range.preset === 'custom' && (
        <CustomRangeForm key={`${range.start}/${range.end}`} range={range} onApply={selectCustom} />
      )}
    </div>
  )
}
