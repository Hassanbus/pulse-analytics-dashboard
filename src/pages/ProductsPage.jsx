import { useOutletContext } from 'react-router'
import PageHeader from '../components/ui/PageHeader.jsx'
import PageSkeleton from '../components/ui/PageSkeleton.jsx'
import { useDateRange } from '../hooks/useDateRange.js'
import { formatRange } from '../lib/format.js'

// Placeholder: the products table is added in a later step.
export default function ProductsPage() {
  const { loading } = useOutletContext()
  const { range } = useDateRange()
  if (loading) return <PageSkeleton variant="table" />
  return <PageHeader title="Products" description={formatRange(range)} />
}
