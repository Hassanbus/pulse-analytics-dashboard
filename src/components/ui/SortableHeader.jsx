import Icon from './Icon.jsx'

// A column header that sorts the table when clicked (a real <button>, so it works with
// the keyboard). aria-sort tells screen readers which column is sorted and in which direction.
export default function SortableHeader({ column, sort, direction, onSort }) {
  const active = sort === column.key
  const ariaSort = active ? (direction === 'asc' ? 'ascending' : 'descending') : undefined
  const icon = active ? (direction === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevrons-up-down'
  return (
    <th scope="col" aria-sort={ariaSort} className={column.numeric ? 'num' : undefined}>
      <button type="button" className={`sort-button${active ? ' is-active' : ''}`} onClick={() => onSort(column.key)}>
        {column.label}
        <Icon name={icon} size={14} />
      </button>
    </th>
  )
}
