import { useId } from 'react'

// A labelled dropdown with an "All ..." choice. The empty value "" means "no filter".
export default function FilterSelect({ label, value, options, allLabel, onChange, formatOption = (o) => o }) {
  const id = useId()
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="select" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOption(option)}
          </option>
        ))}
      </select>
    </div>
  )
}
