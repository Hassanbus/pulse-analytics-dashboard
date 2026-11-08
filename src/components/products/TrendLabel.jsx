import Icon from '../ui/Icon.jsx'

const TEXT = { up: 'Rising', down: 'Falling', flat: 'Steady' }
const ICON = { up: 'arrow-up', down: 'arrow-down' }

// The trend in words, next to the sparkline. "direction" comes from trendDirection()
// in lib/metrics.js: it compares the second half of the period with the first half.
export default function TrendLabel({ direction }) {
  return (
    <span className={`trend trend--${direction}`}>
      {direction !== 'flat' && <Icon name={ICON[direction]} size={14} />}
      {TEXT[direction]}
    </span>
  )
}
