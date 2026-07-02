import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/alumni/sidebar'
import { EditProfileForm } from '@/components/profile/edit-profile-form'

export const metadata: Metadata = {
  title: 'Edit Profile - Alumni Management System',
}

export default async function EditProfilePage() {
  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    redirect('/login')
  }

  // Fetch the user's current Alumni profile
  const alumniData = await prisma.alumni.findUnique({
    where: { userId: session.user.id },
  })

  if (!alumniData) {
    // If somehow they don't have an alumni profile, redirect back
    redirect('/dashboard')
  }

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="flex items-center justify-between px-8 py-5 bg-white shadow-sm border-b border-gray-100 z-10">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1a365d] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {alumniData.firstName[0]}{alumniData.lastName[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative">
          <EditProfileForm initialData={alumniData} />
        </main>
      </div>
    </div>
  )
}
