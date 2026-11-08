import { useRef } from 'react'
import { Outlet } from 'react-router'
import { useDrawer } from '../../hooks/useDrawer.js'
import { useRouteFocus } from '../../hooks/useRouteFocus.js'
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading.js'
import ErrorBoundary from '../ui/ErrorBoundary.jsx'
import Footer from './Footer.jsx'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import './layout.css'
import './drawer.css'

// The frame around every page: sidebar, top bar, page content and footer.
// <Outlet /> is where React Router puts the page that matches the URL.
export default function AppLayout() {
  const drawer = useDrawer()
  const loading = useSimulatedLoading()
  const mainRef = useRef(null)
  const pathname = useRouteFocus(mainRef)

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Sidebar open={drawer.open} onClose={drawer.close} onNavigate={drawer.closeAfterNavigation} />
      {/* "inert" makes the page behind an open drawer unclickable and unfocusable. */}
      <div className="app__body" inert={drawer.open}>
        <TopBar menuOpen={drawer.open} onMenuClick={drawer.toggle} menuButtonRef={drawer.buttonRef} />
        <main id="main" ref={mainRef} className="app__main" tabIndex={-1}>
          {/* A new key per page resets the error boundary when you move to another page. */}
          <ErrorBoundary key={pathname}>
            <Outlet context={{ loading }} />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </div>
  )
}
