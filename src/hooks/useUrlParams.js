import { useSearchParams } from 'react-router'

// Reads and changes values in the URL query string (the part after "?").
// Filters live in the URL, so a copied link shows the same view and the Back button works.
export function useUrlParams() {
  const [params, setParams] = useSearchParams()

  // updateParams({ status: 'refunded', page: null }): null or '' removes a value,
  // which keeps the URL short when a filter is not used.
  function updateParams(changes, options) {
    setParams((current) => {
      const next = new URLSearchParams(current)
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === undefined || value === '') next.delete(key)
        else next.set(key, String(value))
      }
      return next
    }, options)
  }

  return [params, updateParams]
}
