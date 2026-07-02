import { Metadata } from 'next'
import { AlumniDashboard } from '@/components/alumni/dashboard'

export const metadata: Metadata = {
  title: 'Dashboard - Alumni Management System',
}

export default function DashboardPage() {
  return <AlumniDashboard />
}
