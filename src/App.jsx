import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import AppLayout from './components/layout/AppLayout.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

// Each page is downloaded only when it is opened for the first time ("code splitting").
// The chart library is large, so pages without charts load faster this way.
const OverviewPage = lazy(() => import('./pages/OverviewPage.jsx'))
const OrdersPage = lazy(() => import('./pages/OrdersPage.jsx'))
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'))
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'))

// The map of URLs to pages. All pages share AppLayout (sidebar, top bar, footer).
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
