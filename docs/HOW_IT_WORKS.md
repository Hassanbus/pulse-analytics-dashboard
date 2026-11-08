# How Pulse works

This guide explains every file in simple English: **what** it is, **why** it exists and **how** it works.
Then it gives the order to rebuild the project from scratch, and 15 interview questions with short answers.

## The big picture

```
generate.js  ──►  dataset.js  ──►  lib/metrics.js (pure functions)  ──►  pages  ──►  components
(seeded data)     (one copy)       numbers for cards, charts, tables        │
                                                                             │
URL ?range=30d&status=refunded  ──►  hooks (useDateRange, useOrderFilters) ─┘
localStorage (currency, theme)  ──►  SettingsProvider  ──►  useSettings()
```

1. The data is created once in the browser with a seeded random generator, so it is the same on every load.
2. Pages read the date range and filters from the URL.
3. Pages call pure functions (`lib/metrics.js`, `lib/orderTable.js`) to compute the numbers.
4. Components only show the numbers. They format them with `lib/format.js`.

---

## Project root

**`index.html`**
- What: the only HTML page of the app.
- Why: Vite starts from it. Social sites read its `<title>`, description and Open Graph tags without running JavaScript.
- How: a tiny inline script sets `data-theme` on `<html>` before the page is drawn (no white flash in dark mode).
  React renders the app into `<div id="root">`.

**`package.json` / `package-lock.json`**
- What: the project's name, scripts and dependencies; the lock file pins the exact versions.
- Why: `npm install` must install the same versions on every computer and on Vercel.
- How: scripts are `dev`, `build`, `preview`, `lint`, `test` and `test:watch`.

**`vite.config.js`**
- What: the Vite settings.
- Why: Vite needs the React plugin to understand JSX. Vitest reads this same file.
- How: one plugin, `react()`. Everything else uses Vite's defaults.

**`eslint.config.js`**
- What: the lint rules.
- Why: finds mistakes early, like unused variables or hooks used in the wrong place.
- How: the same flat config as the official Vite React template (recommended rules, React Hooks, React Refresh).

**`vercel.json`**
- What: one rewrite rule for Vercel.
- Why: `/orders` is not a real file. Without the rule, opening it directly would give a 404 error.
- How: every path is rewritten to `/index.html`, then React Router shows the right page. Real files (JS, CSS, images) are still served first.

**`.gitignore` / `.gitattributes`**
- What: files Git should not track, and the line-ending rule.
- Why: `node_modules`, `dist` and local tool folders are created again by tools. LF line endings keep the repo the same on Windows and macOS.
- How: simple patterns, one per line.

**`public/favicon.svg`, `public/og-image.png`**
- What: the tab icon and the picture for shared links (1200 x 630 px).
- Why: files in `public/` are copied as they are, with a fixed URL.
- How: the og-image is a Playwright screenshot of the Overview page.

**`docs/PLAN.md`, `docs/screenshot.png`, `README.md`**
- What: the plan written before coding, the README picture and the project front page.
- Why: a reader (or an interviewer) understands the project quickly.

---

## `src/` entry files

**`src/main.jsx`**
- What: the starting point of the app.
- Why: something must connect React to the HTML page.
- How: imports the global CSS first (so component CSS can override it), then renders
  `<BrowserRouter useTransitions={false}>` → `<SettingsProvider>` → `<App />`.
  `useTransitions={false}` makes URL updates happen at once, which the search box needs.

**`src/App.jsx`**
- What: the list of routes (URL → page).
- Why: one place shows every page of the app.
- How: all pages sit inside `AppLayout`. Pages are loaded with `React.lazy`, so each page's code (and the chart library)
  downloads only when it is first opened. `*` catches unknown URLs and shows the 404 page.

---

## `src/data/` — the demo data

**`catalog.js`**
- What: fixed lists: 5 categories, 5 regions, 4 channels, 4 statuses and 40 products with prices.
- Why: real-looking names and prices make the dashboard believable.
- How: plain arrays. Products are `[name, category, price]`.

**`random.js`**
- What: `createRandom(seed)` (the mulberry32 algorithm) and `pickWeighted()`.
- Why: `Math.random()` gives new numbers on every load. A seeded generator gives the same numbers every time.
- How: `createRandom` returns a function that mixes a 32-bit number and returns 0 ≤ n < 1.
  `pickWeighted` rolls a number and walks through the weights to pick an item.

**`generate.js`**
- What: `generateData(seed)` builds the products and about 12,500 orders from Nov 1, 2025 to Oct 31, 2026.
- Why: the brief asked for 12 months of daily orders with realistic patterns.
- How: each product gets hidden "personality" numbers (popularity, trend, refund chance). Each day gets a number of
  orders from growth, weekends, a holiday season and noise. New orders are often "processing". The hidden numbers
  are removed before the data leaves the file.

**`dataset.js`**
- What: runs `generateData()` once and exports `products`, `orders` and `DATA_BOUNDS`.
- Why: every page must use the same copy, so numbers agree between screens.
- How: a module runs only once, so the data is created once per page load.

---

## `src/lib/` — pure functions (all tested)

**`dates.js`**
- What: helpers for dates written as `'YYYY-MM-DD'` strings in UTC (`addDays`, `daysBetween`, `isIsoDate`, ...).
- Why: strings sort correctly, fit in a URL and never move to another day in another time zone.
- How: they turn a string into a UTC `Date`, do the math, and turn it back.

**`ranges.js`**
- What: the date range presets, `resolveRange()`, `previousRange()` and the chart steps (`bucketSize`, `bucketStart`, `chartBuckets`).
- Why: the URL can contain anything, so it must be turned into a safe range. Long ranges need bigger chart steps.
- How: bad values fall back to "Last 30 days"; custom dates are clamped and swapped if needed.
  Up to 31 days uses days, up to 120 days uses weeks (counted back from the last day), longer uses months.

**`collections.js`**
- What: `sumBy()` and `groupBy()`.
- Why: many metrics add up or group lists in the same way.
- How: one loop that fills a `Map`.

**`metrics.js`**
- What: every number on screen: revenue, orders, average order value, refund rate, % change, KPIs,
  orders by channel, revenue by category, top products, revenue series, product rows and trend direction.
- Why: pure functions are easy to test and keep components simple.
- How: only `completed` and `processing` orders count as revenue. `kpis()` compares with the previous period of the
  same length and returns `change: null` when that period is outside the data.

**`format.js`**
- What: money, numbers, percents, changes, statuses and dates as text.
- Why: one place makes every screen look the same.
- How: `Intl.NumberFormat` and `Intl.DateTimeFormat` with English and UTC. Formatters are cached because creating them is slow.

**`summaries.js`**
- What: `describeSeries()` and `describeParts()` write a chart's content as a sentence.
- Why: a screen reader cannot "see" a chart; this text is the chart for those users.
- How: finds the total, highest and lowest step, or lists every part with its share.

**`orderTable.js`**
- What: `filterOrders()`, `sortOrders()`, `paginate()`, `PAGE_SIZE` and the sortable columns.
- Why: the Orders page needs search, filters, sorting and pages; as pure functions they are easy to test.
- How: sorting copies the list and breaks ties by order id, so rows never jump between pages.
  `paginate()` turns any page number into a real page and returns "from / to / total" for the "Showing 21–40" text.

**`csv.js`**
- What: `toCsv()`, `escapeCell()`, `csvFileName()`, `downloadCsv()` and the export columns.
- Why: the brief asked to export the filtered rows without a server.
- How: cells with commas, quotes or line breaks are quoted (RFC 4180); text starting with `= + - @` gets a `'` so
  spreadsheets do not run it as a formula. The text becomes a `Blob`, and a hidden `<a download>` link is clicked.

---

## `src/settings/` — currency and theme

**`storage.js`** — What: `loadSettings()` / `saveSettings()` with localStorage. Why: preferences should survive a reload but
are not filters, so they are not in the URL. How: unknown or broken values fall back to USD and the system theme;
`try/catch` keeps the app working when storage is blocked.

**`settingsContext.js`** — What: the React context object. Why: in its own file, the provider file exports only a component
(fast refresh needs that). How: `createContext(null)`.

**`SettingsProvider.jsx`** — What: holds the settings state for the whole app. Why: any component can read the currency
without passing props through every level. How: an effect sets `data-theme` on `<html>`; `updateSettings()` saves only when
the user changes something.

**`useSettings.js`** — What: a one-line hook. Why: components write `useSettings()` instead of importing the context.
How: `useContext(SettingsContext)`.

---

## `src/hooks/` — reusable logic

**`useUrlParams.js`** — What: read and change query string values. Why: all filters live in the URL. How: wraps
`useSearchParams`; `null` or `''` removes a key, so default values do not fill the URL.

**`useDateRange.js`** — What: `useDateRange()` gives the resolved range and setters; `useRangeSearch()` gives `?range=...`.
Why: one date range for every page, kept when you move between pages. How: links add `useRangeSearch()` to their URL;
a new range also resets the orders page to 1.

**`useOrderFilters.js`** — What: search, status, region, channel, sort, direction and page from the URL, with setters.
Why: keeps the Orders page short. How: only known values are accepted; the search uses `replace: true`, so typing does
not add a Back-button step per letter.

**`useSimulatedLoading.js`** — What: `true` for 700 ms, then `false`. Why: shows the loading skeletons once, like a real
dashboard waiting for a server. How: a timer in an effect; the layout uses it and never unmounts, so it runs once.

**`useDrawer.js`** — What: open/close logic for the mobile menu. Why: a drawer must work well with a keyboard.
How: Escape closes it; focus goes back to the menu button after closing; the drawer closes when the window becomes desktop size.

**`useRouteFocus.js`** — What: after a page change, scroll to the top and focus `<main>`. Why: in a single page app, screen
readers do not notice a new page by themselves. How: an effect that runs when the path changes (not when only filters change).

---

## `src/components/layout/` — the app frame

**`AppLayout.jsx`** — What: skip link, sidebar, top bar, `<main>` with the page, footer. Why: every page shares it.
How: `<Outlet context={{ loading }} />` shows the current page; an `ErrorBoundary` keyed by path and a `Suspense`
with the skeleton wrap the page; `inert` blocks the page behind an open drawer.

**`Sidebar.jsx`** — What: brand and menu links. Why: main navigation. How: `NavLink` sets `aria-current="page"` on the
current link; links keep the date range; focus moves to "Close menu" when the drawer opens.

**`TopBar.jsx`** — What: menu button (small screens), brand, "Demo data through Oct 31, 2026" and the date range picker.
Why: the global control sits above all content. How: the menu button has `aria-expanded` and `aria-controls`.

**`DateRangePicker.jsx`** — What: a native `<select>` with the presets. Why: native controls work with keyboards, phones and
screen readers. How: "Custom range" shows `CustomRangeForm`, which gets a `key` so it resets when the range changes.

**`CustomRangeForm.jsx`** — What: "From" and "To" date fields with an Apply button. Why: half-typed dates should not change
the page. How: `min`/`max` let the browser block dates outside the data or "To" before "From".

**`Logo.jsx`**, **`Footer.jsx`** — What: the brand mark, and the footer with "Demo project with generated data."
Why: branding, and honesty about the data. How: small static components.

---

## `src/components/ui/` — small reusable parts

| File | What | Why | How |
| --- | --- | --- | --- |
| `Icon.jsx` | Line icons drawn with SVG paths | No icon library is needed | A name → path map; `aria-hidden` because text gives the meaning |
| `PageHeader.jsx` | Page title, description and actions | Same header on every page | Also renders `<title>`; React 19 moves it into `<head>` |
| `EmptyState.jsx` | "Nothing here" message with an action | Empty results must explain what to do | `as="h1"` lets the 404 page use it as its main heading |
| `PageSkeleton.jsx` | Grey placeholder shapes | Shows that content is coming, without layout jumps | Same grid as the real page; `role="status"` text for screen readers |
| `ErrorBoundary.jsx` | Catches crashes inside a page | A crash should not leave a blank screen | React only supports this with a class (`getDerivedStateFromError`) |
| `TableScroll.jsx` | Sideways scroll box for wide tables | Tables must not break the layout on phones | `tabIndex={0}` and `aria-label` so keyboard users can scroll it |
| `FilterSelect.jsx` | Labelled `<select>` with an "All ..." option | Three filters share the same pattern | `useId()` links the label and the select |
| `SortableHeader.jsx` | Column header button that sorts | Sorting must work with a keyboard | `aria-sort` on the `<th>` says the column and direction |
| `Pagination.jsx` | First / previous / next / last buttons | 20 rows per page | Buttons are disabled at the first and last page |
| `OptionGroup.jsx` | Radio buttons in a `<fieldset>` | Settings choices | `<legend>` names the group; arrow keys work by default |

---

## `src/components/kpi/` — headline numbers

**`KpiCards.jsx`** — What: the four cards (revenue, orders, average order value, refund rate). Why: used on the Overview
and on product pages. How: a `<dl>` list; revenue is short (`$134.3K`) with the exact value for screen readers.

**`KpiCard.jsx`** — What: one card. Why: one idea per component. How: `<dt>` label, `<dd>` value, `<dd>` change.

**`ChangeBadge.jsx`** — What: "+12.3% vs previous period" or "No earlier data to compare". Why: shows direction with an
arrow and a sign, not only color. How: for refund rate, down is good (`goodWhen="down"`).

---

## `src/components/charts/` — charts (Recharts)

**`ChartCard.jsx`** — What: `<figure>` with a title, the chart, a hidden text summary (`<figcaption>`) and an optional data
table in `<details>`. Why: every chart needs a text version. How: `<details>` opens and closes without JavaScript.

**`ChartTooltip.jsx`** — What: the hover box. Why: theme colors and the value in bold first. How: Recharts passes
`active`, `payload` and `label`.

**`RevenueChart.jsx`** — What: revenue over time as an area chart. Why: shows the trend. How: `responsive` follows the card
width; `niceTicks="snap125"` gives round axis numbers; one series, so no legend; animations are off.

**`ChannelChart.jsx`** — What: orders per channel as horizontal bars with the value at the end of each bar.
Why: long names fit on phones and no hover is needed to read values. How: `layout="vertical"`, 20 px bars, one color.

**`CategoryChart.jsx`** — What: revenue per category as a donut, with a legend that lists value and share.
Why: the brief asked for a donut; the legend makes it readable without color. How: each data item has a `fill`
(the deprecated `Cell` is not used); colors follow the fixed category order.

**`SeriesTable.jsx`** — What: the numbers behind the revenue chart as a table. Why: the fully accessible version of the chart.

**`Sparkline.jsx`** — What: a tiny line chart without axes. Why: shows each product's trend in a table row.
How: `accessibilityLayer={false}` and `aria-hidden`, because `TrendLabel` says the trend in words.

Chart colors come from `tokens.css`. The palette was checked with a color-blind safety validator, and text never uses chart colors.

---

## `src/components/orders/` and `src/components/products/`

**`OrderFilters.jsx`** — What: search box and status/region/channel filters, plus "Clear filters". Why: the brief's filters.
How: a `<form role="search">`; every change updates the URL.

**`OrdersTable.jsx`** — What: one page of orders. Why: the parent page filters, sorts and pages; this only shows rows.
How: product names link to their product page; a hidden caption says the current sort.

**`StatusBadge.jsx`** — What: a colored dot plus the status word. Why: the word means color is never the only clue.
How: imports its own `status.css`, so it looks right on every page.

**`TopProductsTable.jsx`** — What: the top 5 products on the Overview. **`ProductsTable.jsx`** — What: all 40 products with
units, revenue, sparkline and trend word. **`TrendLabel.jsx`** — What: "Rising", "Falling" or "Steady" (second half of the
period vs the first half). **`ProductCharts.jsx`** — What: the charts of a product page. **`RecentOrders.jsx`** — What: the
latest 5 orders of a product. Why (all): split into small parts, each with one job. How: they get their data as props.

---

## `src/pages/` — one file per screen

**`OverviewPage.jsx`** — What: KPIs, three charts and the top products. How: one `useMemo` computes everything from the
range; `if (loading)` shows the skeleton.

**`OrdersPage.jsx`** — What: the orders table page. How: three `useMemo` steps (range → filters → sort), then `paginate()`.
Export CSV writes all filtered rows, not only the current page.

**`ProductsPage.jsx`** — What: the products table. How: `productRows()` in one `useMemo`.

**`ProductDetailsPage.jsx`** — What: one product. How: reads `:productId` with `useParams()`, runs the same metrics on that
product's orders; shows "Product not found" or "No orders in this period" when needed; "View orders" opens the
Orders page already searching for the product.

**`SettingsPage.jsx`** — What: currency and theme. How: two `OptionGroup`s; changes apply at once and are saved.

**`NotFoundPage.jsx`** — What: the 404 page with a link back to the Overview.

---

## Styles

| File | What | Why | How |
| --- | --- | --- | --- |
| `styles/tokens.css` | Colors, spacing, type sizes, radius | One place for the design; dark mode | `:root` for light, `[data-theme='dark']` for dark |
| `styles/base.css` | Reset, focus ring, `.sr-only` | Same base everywhere | `:focus-visible` outline; reduced motion turns off animation |
| `styles/ui.css` | Cards, buttons, fields | Shared building blocks | 40 px minimum height for easy tapping |
| `styles/page.css` | Page column, page header, 2-column grid | Same page structure | Grid becomes 2 columns at 1024 px |
| `styles/table.css` | Tables, sort buttons, pagination | Shared by all tables | `tabular-nums` so digits line up |
| `styles/states.css` | Skeletons and empty states | Loading and empty looks | A moving gradient ("shimmer") |
| `layout/layout.css`, `sidebar.css`, `drawer.css`, `range-picker.css` | Frame, sidebar, drawer, date picker | Next to the components that use them | Drawer below 1024 px with `transform` and `visibility` |
| `kpi/kpi.css`, `charts/charts.css`, `charts/donut.css` | Cards and charts | Same reason | CSS colors the SVG axis text |
| `orders/orders.css`, `orders/status.css`, `products/products.css`, `pages/settings.css` | Page parts | Same reason | Small media queries for phones |

---

## Tests (`npm test`, 76 tests)

| File | What it checks |
| --- | --- |
| `lib/metrics.test.js` | Every function in `metrics.js`, with a tiny hand-made order list (`test/fixtures.js`) |
| `lib/csv.test.js` | Quoting, formula guard, header and rows, file name, and the download (with a fake `document`) |
| `lib/ranges.test.js`, `lib/dates.test.js` | Presets, bad URL values, previous period, day/week/month steps, date math |
| `lib/orderTable.test.js` | Filters, search, stable sort, page numbers |
| `lib/format.test.js`, `lib/summaries.test.js` | Text output of numbers, dates and chart summaries |
| `lib/collections.test.js`, `data/random.test.js`, `data/generate.test.js` | Helpers, the seeded generator, and that the data is the same every time |

---

## Rebuild it from scratch: the order

1. Create `package.json`, install React, React Router, Recharts, Vite, the React plugin, ESLint and Vitest.
   Add `vite.config.js`, `eslint.config.js`, `index.html` and a simple `main.jsx`.
2. Write the design tokens (`tokens.css`) and `base.css`. Check the contrast of the text colors.
3. Data: `catalog.js` → `random.js` → `dates.js` → `generate.js` → `dataset.js`, with tests.
4. Logic: `ranges.js` → `collections.js` → `metrics.js`, with tests for every function.
5. `format.js` and `summaries.js`, with tests.
6. Settings: `storage.js` → `settingsContext.js` → `SettingsProvider.jsx` → `useSettings.js`.
7. URL hooks: `useUrlParams.js` → `useDateRange.js`.
8. App frame: `Icon`, `Logo`, `Sidebar`, `TopBar`, `DateRangePicker`, `CustomRangeForm`, `Footer`, `useDrawer`,
   `useRouteFocus`, `useSimulatedLoading`, `AppLayout`, `ErrorBoundary`, `PageHeader`, `PageSkeleton`, `EmptyState`,
   `NotFoundPage` and the routes in `App.jsx`.
9. Overview: KPI components, `ChartCard`, `ChartTooltip`, the three charts, `SeriesTable`, `TopProductsTable`, `OverviewPage`.
10. Orders: `orderTable.js` and `csv.js` with tests → `useOrderFilters` → filters, table, pagination → `OrdersPage`.
11. Products: `Sparkline`, `TrendLabel`, `ProductsTable`, `ProductsPage` → `RecentOrders`, `ProductCharts`, `ProductDetailsPage`.
12. Settings page: `OptionGroup`, `SettingsPage`.
13. Load pages with `React.lazy` and show the skeleton in `Suspense`.
14. Check in a real browser at 360, 768 and 1280 px, with the keyboard and in dark mode.
15. Add `vercel.json`, the Open Graph tags and `og-image.png`, write the README, deploy.

---

## 15 interview questions

**1. Why is the data the same on every load?**
It uses a seeded random generator (mulberry32) with a fixed seed instead of `Math.random()`, and a fixed date range.
The same seed always gives the same numbers.

**2. Where do the numbers on screen come from?**
From pure functions in `lib/metrics.js`. Pages call them inside `useMemo` with the date range; components only format and show the results.

**3. How does "% change vs previous period" work?**
`previousRange()` takes the period of the same length just before. `percentChange()` returns `null` when the old value is 0,
and `kpis()` returns `null` when that period starts before the data, so the card says "No earlier data to compare".

**4. Why keep filters and the date range in the URL and not in React state?**
A copied link opens the same view, a reload keeps it, and Back/Forward work. Invalid URL values fall back to safe defaults.

**5. The search box writes to the URL on every key press. How does that stay smooth?**
`replace: true` stops each letter from becoming a history entry, and `BrowserRouter useTransitions={false}` applies URL
updates at once, so the controlled input never shows an old value.

**6. Why are dates strings like '2026-10-31' in UTC?**
They compare correctly as text, fit in the URL, and a time zone can never move them to another day.

**7. How do sorting and pagination work?**
`sortOrders()` sorts a copy and breaks ties by order id, so the order is stable. `paginate()` cuts 20 rows and fixes page
numbers that are too big or not numbers.

**8. How does Export CSV work without a server?**
`toCsv()` builds the text (quoting commas and quotes, guarding against formulas). `downloadCsv()` puts it in a `Blob`,
makes an object URL, clicks a hidden `<a download>` and frees the URL a second later.

**9. How did you test `downloadCsv()`, which needs a browser, in Node?**
With `vi.stubGlobal('document', ...)` for a fake document, spies on `URL.createObjectURL` / `revokeObjectURL`,
and fake timers for the delayed clean-up. The test also reads the Blob's text.

**10. How are the charts accessible?**
Each chart has a hidden text summary in its `<figcaption>`, the revenue chart has a data table, the donut legend lists every value,
and Recharts makes charts keyboard-focusable (arrow keys move the tooltip). Colors are color-blind safe and never the only signal.

**11. How does dark mode work without a white flash?**
All colors are CSS variables with a second set under `[data-theme='dark']`. A small script in `index.html` sets the
attribute before the first paint; React keeps it in sync and saves the choice.

**12. Why is the currency "display only"?**
It only changes the currency code given to `Intl.NumberFormat`. Converting would need live exchange rates from an API,
and the project has no backend or API keys. The Settings page says this clearly.

**13. What does the error boundary do, and why is it a class?**
It catches render errors in a page and shows a message while the menu still works. React only offers
`getDerivedStateFromError` in class components. Its `key` is the path, so it resets on the next page.

**14. How did you keep the bundle small?**
Each page is loaded with `React.lazy`. The chart library is only downloaded with pages that have charts,
so the first JavaScript file is about 86 kB (gzip).

**15. How does the mobile menu work with a keyboard?**
Opening it moves focus to "Close menu", Escape closes it and focus returns to the menu button, and the page behind it is
`inert`, so Tab cannot reach hidden content. When closed, `visibility: hidden` removes its links from the Tab order.
