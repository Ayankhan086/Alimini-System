// app/(dashboard)/dashboard/admin/page.tsx
import { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/dashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Alumni Management System',
}

export default function AdminDashboardPage() {
  return <AdminDashboard />
}