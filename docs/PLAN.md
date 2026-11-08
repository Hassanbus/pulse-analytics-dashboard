# Pulse — Build Plan

Pulse is a front-end only analytics dashboard for a fictional online store.
All data is generated in the browser. There is no backend, no database, no API keys and no environment variables.

## 1. Tools (versions checked with `npm view` on 2026-11-08)

| Tool | Version | Why |
| --- | --- | --- |
| Node / npm | 24.22.1 / 11.19.1 | Runs Vite, ESLint and Vitest |
| vite | 8.3.6 | Dev server and production build |
| @vitejs/plugin-react | 6.2.1 | JSX support and fast refresh |
| react / react-dom | 19.3.1 | UI library |
| react-router | 8.5.1 | Pages and URL query string |
| recharts | 3.10.1 | Charts |
| vitest | 5.1.0 | Unit tests |
| eslint (+ @eslint/js, react-hooks, react-refresh, globals) | 10.14.0 | Lint, same setup as the official Vite React template |
| playwright (npx cache) | 1.61.0 | Screenshot for `public/og-image.png` (its Chromium build 1228 is already installed) |

No other UI or state libraries. Styles are plain CSS with CSS variables.

## 2. Data model

`src/data/generate.js` uses a seeded random generator (mulberry32), so every load creates the same data.

- Period: 365 days, **2025-11-01 to 2026-10-31**. The demo "today" is fixed to 2026-10-31,
  so "Last 7 days" always has data and the numbers never change.
- 40 products in 5 categories, 5 regions, 4 channels.
- Order fields: `id, date, productId, product, category, region, channel, quantity, amount, status`.
- Status: `completed`, `processing`, `refunded`, `cancelled`.
  Revenue counts only `completed` and `processing` orders.

## 3. Metrics (pure functions in `src/lib/metrics.js`)

- Revenue, orders, average order value (AOV), refund rate.
- % change vs the previous period of the same length. If the previous period is not fully
  inside the data (for example "Last 12 months"), the change is shown as "No earlier data".
- Revenue over time (day, week or month buckets), orders by channel, revenue by category,
  top products, product rows with trend values.

## 4. Screens and URL

| Route | Content |
| --- | --- |
| `/` | Overview: 4 KPI cards, revenue line chart, orders by channel bars, revenue by category donut, top 5 products |
| `/orders` | Table: search, status/region/channel filters, sort, 20 rows per page, Export CSV |
| `/products` | Table: units sold, revenue, trend sparkline |
| `/products/:productId` | Product details: KPIs and its own revenue chart |
| `/settings` | Currency (USD/EUR/EGP, display only), light/dark theme |

Query string: `range=7d|30d|90d|12m|custom`, `from`, `to` (custom only), and on Orders:
`q`, `status`, `region`, `channel`, `sort`, `dir`, `page`. Default values are left out of the URL.
Settings are saved in `localStorage` (they are preferences, not filters).

## 5. Build order (one feature = lint + tests + build + one commit)

1. Scaffold: Vite, React, ESLint, Vitest, base CSS tokens, this plan.
2. Data: seeded generator, catalog, date helpers + tests.
3. Metrics: all metric functions + tests.
4. App shell: router, sidebar (drawer on mobile), top bar, date range picker in the URL,
   simulated first load with skeletons, error boundary, 404 page, footer note.
5. Overview page.
6. Orders page + CSV export + tests.
7. Products page + product details page.
8. Settings page (currency, theme).
9. Browser check at 360, 768 and 1280 px; accessibility and responsive fixes.
10. `vercel.json`, meta tags, `public/og-image.png` (Playwright), README, `docs/HOW_IT_WORKS.md`.

## 6. Quality rules

- Files under about 120 lines, one idea per component, comments explain WHY in simple English.
- Accessibility: labels on every input, visible focus, keyboard use, good contrast,
  text summaries of every chart for screen readers, `aria-sort` on sortable headers.
- Responsive at 360, 768 and 1280 px. Tables scroll sideways on small screens.

## 7. Publish (after the local checks pass)

1. `gh auth status` and `gh api user --jq .login` → show the login and **wait for confirmation**.
2. `gh repo create pulse-analytics-dashboard --public --source=. --remote=origin --push --description "..."`.
3. `npx vercel whoami`, then `npx vercel --prod --yes`; check `/`, `/orders`, `/products` return HTTP 200 with curl.
4. Set `og:image` to the absolute production URL, commit, push, deploy again.
5. `gh repo edit --homepage <URL> --add-topic react --add-topic dashboard --add-topic recharts`.
6. Put the live URL in README.md, commit and push.

## 8. Assumptions and risks

- Currency is display only: the same number is shown with a different symbol. No conversion.
- The `og:image` must be an absolute URL for social sites, so it is updated after the first deploy.
- Commits use the author "Hasan Fawzy <302573699+Hassanbus@users.noreply.github.com>" (set for this repo only).
