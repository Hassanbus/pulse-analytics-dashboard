import { useId } from 'react'
import { CHANNELS, REGIONS, STATUSES } from '../../data/catalog.js'
import { formatStatus } from '../../lib/format.js'
import FilterSelect from '../ui/FilterSelect.jsx'

// The search box and the three filters above the orders table.
// role="search" marks this area as a search landmark for screen reader users.
export default function OrderFilters({ filters }) {
  const searchId = useId()
  return (
    <form className="filters" role="search" onSubmit={(event) => event.preventDefault()}>
      <div className="field field--grow">
        <label className="field__label" htmlFor={searchId}>
          Search
        </label>
        <input
          id={searchId}
          className="input"
          type="search"
          placeholder="Order ID or product"
          value={filters.query}
          onChange={(event) => filters.setQuery(event.target.value)}
        />
      </div>
      <FilterSelect
        label="Status"
        value={filters.status}
        options={STATUSES}
        allLabel="All statuses"
        formatOption={formatStatus}
        onChange={(value) => filters.setFilter('status', value)}
      />
      <FilterSelect
        label="Region"
        value={filters.region}
        options={REGIONS}
        allLabel="All regions"
        onChange={(value) => filters.setFilter('region', value)}
      />
      <FilterSelect
        label="Channel"
        value={filters.channel}
        options={CHANNELS}
        allLabel="All channels"
        onChange={(value) => filters.setFilter('channel', value)}
      />
      {filters.hasFilters && (
        <button type="button" className="button button--secondary" onClick={filters.clearFilters}>
          Clear filters
        </button>
      )}
    </form>
  )
}
