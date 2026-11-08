import { DATA_BOUNDS } from '../../data/dataset.js'
import { formatDate } from '../../lib/format.js'
import Icon from '../ui/Icon.jsx'
import DateRangePicker from './DateRangePicker.jsx'
import Logo from './Logo.jsx'

// The bar above every page. It holds the global date range, so one control changes every screen.
export default function TopBar({ menuOpen, onMenuClick, menuButtonRef }) {
  return (
    <header className="topbar">
      <div className="topbar__start">
        <button
          ref={menuButtonRef}
          type="button"
          className="icon-button menu-button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="sidebar"
          onClick={onMenuClick}
        >
          <Icon name="menu" />
        </button>
        <Logo className="topbar__brand" />
        <p className="topbar__note">Demo data through {formatDate(DATA_BOUNDS.end)}</p>
      </div>
      <DateRangePicker />
    </header>
  )
}
