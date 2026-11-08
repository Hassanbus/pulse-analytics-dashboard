import { Component } from 'react'
import EmptyState from './EmptyState.jsx'

// If a page crashes while rendering, React would show a blank white screen.
// An error boundary catches the error and shows a message instead; the menu keeps working.
// React only supports this with a class component, so this is the one class in the app.
export default class ErrorBoundary extends Component {
  state = { error: null }

  // React calls this when a child component throws. The new state shows the fallback UI.
  static getDerivedStateFromError(error) {
    return { error }
  }

  // A real product would send this to an error tracking service. We log it for developers.
  componentDidCatch(error, info) {
    console.error('Page crashed:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert">
        <EmptyState
          as="h1"
          icon="alert"
          title="Something went wrong"
          message="This page hit an unexpected error. Reload the page, or open another page from the menu."
        >
          {/* A reload is safe: the dates and filters live in the URL, so the same view comes back. */}
          <button type="button" className="button" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </EmptyState>
      </div>
    )
  }
}
