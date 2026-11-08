import Icon from './Icon.jsx'

// Page controls. The buttons are disabled on the first and the last page,
// so nobody can go to a page that does not exist.
export default function Pagination({ page, pageCount, onChange }) {
  const buttons = [
    { label: 'First page', icon: 'chevrons-left', target: 1, disabled: page <= 1 },
    { label: 'Previous page', icon: 'chevron-left', target: page - 1, disabled: page <= 1 },
    { label: 'Next page', icon: 'chevron-right', target: page + 1, disabled: page >= pageCount },
    { label: 'Last page', icon: 'chevrons-right', target: pageCount, disabled: page >= pageCount },
  ]
  const button = (item) => (
    <button
      key={item.label}
      type="button"
      className="icon-button"
      aria-label={item.label}
      disabled={item.disabled}
      onClick={() => onChange(item.target)}
    >
      <Icon name={item.icon} />
    </button>
  )

  return (
    <nav className="pagination" aria-label="Pagination">
      {buttons.slice(0, 2).map(button)}
      <span className="pagination__status">
        Page {page} of {pageCount}
      </span>
      {buttons.slice(2).map(button)}
    </nav>
  )
}
