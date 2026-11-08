// The Pulse brand: a small "heartbeat" mark and the name.
export default function Logo({ className = '' }) {
  return (
    <span className={`logo ${className}`}>
      <svg className="logo__mark" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" focusable="false">
        <rect width="32" height="32" rx="8" fill="var(--accent-bg)" />
        <path
          d="M5 17h5l3-7 5 13 3-6h6"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="logo__text">Pulse</span>
    </span>
  )
}
