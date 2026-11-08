import { useEffect, useState } from 'react'

// Real dashboards wait for a server. We have no server, so we pretend to load once,
// when the app opens. This lets people see the loading skeletons of the design.
// The layout uses this hook and never unmounts, so the wait happens only one time.
export function useSimulatedLoading(delay = 700) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay)
    return () => clearTimeout(timer) // stop the timer if the component goes away
  }, [delay])

  return loading
}
