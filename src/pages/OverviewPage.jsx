import { useOutletContext } from 'react-router'
import PageHeader from '../components/ui/PageHeader.jsx'
import PageSkeleton from '../components/ui/PageSkeleton.jsx'
import { useDateRange } from '../hooks/useDateRange.js'
import { formatRange } from '../lib/format.js'

// Placeholder: the KPI cards and charts are added in the next step.
export default function OverviewPage() {
  const { loading } = useOutletContext()
  const { range } = useDateRange()
  if (loading) return <PageSkeleton />
  return <PageHeader title="Overview" description={formatRange(range)} />
}
