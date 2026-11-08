import { formatChange } from '../../lib/format.js'
import Icon from '../ui/Icon.jsx'

// The % change against the previous period. The arrow and the +/- sign show the direction,
// so color is never the only clue. Color says if that is good or bad: for refunds, down is good.
export default function ChangeBadge({ change, goodWhen = 'up' }) {
  if (change === null) {
    return <span className="change change--none">No earlier data to compare</span>
  }
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'flat'
  const tone = direction === 'flat' ? 'neutral' : direction === goodWhen ? 'good' : 'bad'
  return (
    <>
      <span className={`change change--${tone}`}>
        {direction !== 'flat' && <Icon name={`arrow-${direction}`} size={14} />}
        {formatChange(change)}
      </span>
      <span className="change__context">vs previous period</span>
    </>
  )
}
