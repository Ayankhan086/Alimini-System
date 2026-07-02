import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserProfile } from '@/components/profile/user-profile'

export const metadata: Metadata = {
  title: 'Alumni Profile - Alumni Management System',
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    redirect('/login')
  }

  // Fetch real data
  const alumniData = await prisma.alumni.findUnique({
    where: { userId: session.user.id },
  })

  if (!alumniData) {
    redirect('/dashboard')
  }

  return <UserProfile initialData={alumniData} />
}