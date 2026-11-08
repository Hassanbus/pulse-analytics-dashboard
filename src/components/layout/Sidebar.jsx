import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router'
import { useRangeSearch } from '../../hooks/useDateRange.js'
import Icon from '../ui/Icon.jsx'
import Logo from './Logo.jsx'
import './sidebar.css'

const LINKS = [
  { to: '/', label: 'Overview', icon: 'overview' },
  { to: '/orders', label: 'Orders', icon: 'orders' },
  { to: '/products', label: 'Products', icon: 'products' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

// The main menu. On small screens CSS turns it into a drawer that slides in from the left.
export default function Sidebar({ open, onClose, onNavigate }) {
  const rangeSearch = useRangeSearch()
  const closeButtonRef = useRef(null)

  // When the drawer opens, move focus into it, so keyboard users start inside the menu.
  useEffect(() => {
    if (open) closeButtonRef.current?.focus()
  }, [open])

  return (
    <>
      <div className={`sidebar-backdrop${open ? ' is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      {/* The outer box fills the whole column height; the inner box sticks to the top while you scroll.
          The <nav> holds the brand too, so every part of the sidebar is inside a landmark. */}
      <div id="sidebar" className={`sidebar${open ? ' is-open' : ''}`}>
        <nav className="sidebar__inner" aria-label="Main">
          <div className="sidebar__header">
            <Logo />
            <button
              ref={closeButtonRef}
              type="button"
              className="icon-button sidebar__close"
              aria-label="Close menu"
              onClick={onClose}
            >
              <Icon name="close" />
            </button>
          </div>
          <ul className="nav-list">
            {LINKS.map((link) => (
              <li key={link.to}>
                {/* NavLink marks the current page with aria-current="page" (styled in sidebar.css). */}
                <NavLink
                  to={{ pathname: link.to, search: rangeSearch }}
                  end={link.to === '/'}
                  className="nav-link"
                  onClick={onNavigate}
                >
                  <Icon name={link.icon} />
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
