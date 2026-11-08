import { Route, Routes } from 'react-router'
import AppLayout from './components/layout/AppLayout.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import OverviewPage from './pages/OverviewPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

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
