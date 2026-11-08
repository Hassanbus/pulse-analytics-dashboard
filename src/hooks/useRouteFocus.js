import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

// In a single page app the browser does not "load" a new page, so screen readers do not
// notice the change. After moving to another page we scroll to the top and move focus
// to the main content, so the new page is announced and Tab starts from there.
export function useRouteFocus(mainRef) {
  const { pathname } = useLocation()
  const lastPath = useRef(pathname)

  useEffect(() => {
    if (lastPath.current === pathname) return // first render or only the filters changed
    lastPath.current = pathname
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname, mainRef])

  return pathname
}
