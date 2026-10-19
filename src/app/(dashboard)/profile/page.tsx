import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserProfile } from '@/components/profile/user-profile'
import { getActiveSessionUser } from '@/lib/active-session'

export const metadata: Metadata = {
  title: 'Alumni Profile - Alumni Management System',
}

export default async function ProfilePage() {
  const user = await getActiveSessionUser()
  if (!user) {
    redirect('/login')
  }
  if (user.role !== 'ALUMNI') redirect('/dashboard')

  // Fetch real data
  const alumniData = await prisma.alumni.findUnique({
    where: { userId: user.id },
  })

  if (!alumniData) {
    redirect('/dashboard')
  }

  return <UserProfile initialData={alumniData} />
}