import { Link } from 'react-router'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useRangeSearch } from '../hooks/useDateRange.js'

// Shown for any URL that does not match a page (the "*" route in App.jsx).
export default function NotFoundPage() {
  const rangeSearch = useRangeSearch()
  return (
    <>
      <title>Page not found · Pulse</title>
      <EmptyState
        as="h1"
        icon="search"
        title="Page not found"
        message="This page does not exist. The link may be old or have a typo."
      >
        <Link className="button" to={{ pathname: '/', search: rangeSearch }}>
          Go to Overview
        </Link>
      </EmptyState>
    </>
  )
}
