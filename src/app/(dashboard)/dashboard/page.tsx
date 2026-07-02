import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AlumniDashboard } from '@/components/alumni/dashboard'

export const metadata: Metadata = {
  title: 'Dashboard - Alumni Management System',
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    redirect('/login')
  }

  // Fetch real data
  const alumniData = await prisma.alumni.findUnique({
    where: { userId: session.user.id },
  })

  if (!alumniData) {
    // Edge case if user is admin or somehow doesn't have an alumni profile yet
    if (session.user.role === 'ADMIN') {
      redirect('/dashboard/admin')
    }
    // Fallback if missing profile (though auth logic usually ensures it)
    return <div>Profile not found. Please contact support.</div>
  }

  return <AlumniDashboard alumniData={alumniData} />
}
