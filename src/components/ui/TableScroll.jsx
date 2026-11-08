// Wide tables scroll sideways on small screens instead of breaking the page layout.
// tabIndex={0} lets keyboard users scroll it with the arrow keys,
// and the label tells screen reader users what this scroll area holds.
export default function TableScroll({ label, children }) {
  return (
    <div className="table-scroll" role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  )
}
