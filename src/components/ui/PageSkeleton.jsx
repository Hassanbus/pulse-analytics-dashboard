// Grey placeholder shapes shown while the app "loads". They have the same layout as the
// real page, so nothing jumps around when the content arrives.
export default function PageSkeleton({ variant = 'dashboard' }) {
  return (
    <div className="skeleton-page" role="status">
      <span className="sr-only">Loading dashboard data…</span>
      <div className="skeleton skeleton--title" />
      {variant === 'dashboard' ? (
        <>
          <div className="skeleton-grid">
            {[1, 2, 3, 4].map((key) => (
              <div key={key} className="skeleton skeleton--card" />
            ))}
          </div>
          <div className="skeleton skeleton--chart" />
          <div className="skeleton-grid skeleton-grid--two">
            <div className="skeleton skeleton--chart" />
            <div className="skeleton skeleton--chart" />
          </div>
        </>
      ) : (
        <div className="skeleton-table">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="skeleton skeleton--row" />
          ))}
        </div>
      )}
    </div>
  )
}
