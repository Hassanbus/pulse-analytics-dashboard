import { useId } from 'react'

// A group of radio buttons. <fieldset> and <legend> give the group its name for screen
// readers, and real radio buttons already work with the arrow keys.
export default function OptionGroup({ legend, hint, name, value, options, onChange }) {
  const hintId = useId()
  return (
    <section className="card">
      <fieldset className="option-group" aria-describedby={hint ? hintId : undefined}>
        <legend className="option-group__legend">{legend}</legend>
        {hint && (
          <p id={hintId} className="option-group__hint">
            {hint}
          </p>
        )}
        <div className="option-group__options">
          {options.map((option) => (
            <label key={option.value} className="option">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
              />
              <span>{option.label}</span>
              {option.example && <span className="option__example">{option.example}</span>}
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  )
}
