import { useSearchParams } from 'react-router'
import { DATA_BOUNDS } from '../data/dataset.js'
import { DEFAULT_PRESET, resolveRange } from '../lib/ranges.js'
import { useUrlParams } from './useUrlParams.js'

const RANGE_KEYS = ['range', 'from', 'to']

// The chosen date range lives in the URL: ?range=7d or ?range=custom&from=...&to=...
// Every page reads it here, so one picker changes every screen.
export function useDateRange() {
  const [params, updateParams] = useUrlParams()
  const range = resolveRange(
    { range: params.get('range'), from: params.get('from'), to: params.get('to') },
    DATA_BOUNDS,
  )

  // A new range changes the list of orders, so the orders table goes back to page 1.
  function selectPreset(preset) {
    if (preset === 'custom') {
      updateParams({ range: 'custom', from: range.start, to: range.end, page: null })
    } else {
      updateParams({ range: preset === DEFAULT_PRESET ? null : preset, from: null, to: null, page: null })
    }
  }

  function selectCustom(from, to) {
    updateParams({ range: 'custom', from, to, page: null })
  }

  return { range, selectPreset, selectCustom }
}

// Only the date range part of the URL, like '?range=7d'.
// Links add it, so moving to another page keeps the same dates.
export function useRangeSearch() {
  const [params] = useSearchParams()
  const kept = new URLSearchParams()
  for (const key of RANGE_KEYS) {
    if (params.has(key)) kept.set(key, params.get(key))
  }
  const text = kept.toString()
  return text ? `?${text}` : ''
}
