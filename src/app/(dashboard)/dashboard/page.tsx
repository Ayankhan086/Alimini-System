import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AlumniDashboard } from '@/components/alumni/dashboard'
import { getActiveSessionUser } from '@/lib/active-session'

export const metadata: Metadata = {
  title: 'Dashboard - Alumni Management System',
}

export default async function DashboardPage() {
  const user = await getActiveSessionUser()
  if (!user) {
    redirect('/login')
  }

  if (user.role === 'SUPER_ADMIN' || user.role === 'SUB_ADMIN') redirect('/dashboard/admin')
  if (user.role === 'FACULTY') redirect('/dashboard/faculty')

  const alumniData = await prisma.alumni.findUnique({
    where: { userId: user.id },
  })

  if (!alumniData) {
    if (user.role === 'STUDENT') {
      redirect('/dashboard/student')
    }
    return <div>Profile not found. Please contact support.</div>
  }

  return <AlumniDashboard alumniData={alumniData} />
}
