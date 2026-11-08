// Simple line icons drawn with SVG paths, so we need no icon library.
// They are decorative (aria-hidden): the text or aria-label next to them carries the meaning.
const PATHS = {
  overview: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  orders: <path d="M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h4" />,
  products: <path d="M21 8 12 3 3 8l9 5 9-5ZM3 8v8l9 5 9-5V8M12 13v8" />,
  settings: (
    <>
      <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
      <circle cx="15" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  calendar: <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />,
  download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
  search: <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-3.5-3.5" />,
  empty: <path d="M3 13h5l1.5 3h5l1.5-3h5M5.5 5h13L21 13v6H3v-6z" />,
  alert: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 8v5M12 16h.01" />,
  'arrow-up': <path d="M12 19V5M5 12l7-7 7 7" />,
  'arrow-down': <path d="M12 5v14M19 12l-7 7-7-7" />,
  'arrow-left': <path d="M19 12H5M12 19l-7-7 7-7" />,
  'chevron-left': <path d="m15 18-6-6 6-6" />,
  'chevron-right': <path d="m9 18 6-6-6-6" />,
  'chevrons-left': <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />,
  'chevrons-right': <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />,
  'chevron-up': <path d="m18 15-6-6-6 6" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevrons-up-down': <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />,
}

export default function Icon({ name, size = 20, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
