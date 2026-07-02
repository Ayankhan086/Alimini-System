// app/(dashboard)/profile/page.tsx
import { Metadata } from 'next'
import { UserProfile } from '@/components/profile/user-profile'

export const metadata: Metadata = {
  title: 'Alumni Profile - Alumni Management System',
}

export default function ProfilePage() {
  return <UserProfile />
}