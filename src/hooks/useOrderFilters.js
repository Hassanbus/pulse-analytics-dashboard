import { CHANNELS, REGIONS, STATUSES } from '../data/catalog.js'
import { SORTABLE } from '../lib/orderTable.js'
import { useUrlParams } from './useUrlParams.js'

const DEFAULT_SORT = 'date'

// Only accept values we know, so a strange URL cannot break the table.
function allowed(value, list) {
  return list.includes(value) ? value : ''
}

// The Orders page keeps its search, filters, sort and page in the URL, so a shared link
// opens exactly the same table. Default values are left out to keep the URL short.
export function useOrderFilters() {
  const [params, updateParams] = useUrlParams()
  const sort = SORTABLE[params.get('sort')] ? params.get('sort') : DEFAULT_SORT
  const dir = params.get('dir')

  const filters = {
    query: params.get('q') ?? '',
    status: allowed(params.get('status'), STATUSES),
    region: allowed(params.get('region'), REGIONS),
    channel: allowed(params.get('channel'), CHANNELS),
    sort,
    direction: dir === 'asc' || dir === 'desc' ? dir : SORTABLE[sort],
    page: params.get('page') ?? 1,
  }

  // The search box changes on every key press. "replace" stops each letter from becoming
  // a separate step in the Back button history.
  function setQuery(value) {
    updateParams({ q: value, page: null }, { replace: true })
  }

  // A new filter shows a different list, so the table goes back to page 1.
  function setFilter(key, value) {
    updateParams({ [key]: value, page: null })
  }

  // Clicking the sorted column flips the direction; a new column starts with its natural one.
  function setSort(key) {
    const opposite = filters.direction === 'asc' ? 'desc' : 'asc'
    const direction = key === filters.sort ? opposite : SORTABLE[key]
    updateParams({
      sort: key === DEFAULT_SORT ? null : key,
      dir: direction === SORTABLE[key] ? null : direction,
      page: null,
    })
  }

  function setPage(page) {
    updateParams({ page: page === 1 ? null : page })
  }

  function clearFilters() {
    updateParams({ q: null, status: null, region: null, channel: null, page: null })
  }

  const hasFilters = Boolean(filters.query || filters.status || filters.region || filters.channel)
  return { ...filters, hasFilters, setQuery, setFilter, setSort, setPage, clearFilters }
}
