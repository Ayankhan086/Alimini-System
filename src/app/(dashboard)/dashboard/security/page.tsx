import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Sidebar as AdminSidebar } from '@/components/admin/sidebar'
import { Sidebar as AlumniSidebar } from '@/components/alumni/sidebar'
import { ChangePasswordForm } from '@/components/profile/change-password-form'
import { getActiveSessionUser } from '@/lib/active-session'

export const metadata: Metadata = {
  title: 'Account Security - Alumni Management System',
}

export default async function SecurityPage() {
  const user = await getActiveSessionUser()
  if (!user) redirect('/login')
  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'SUB_ADMIN'

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {isAdmin ? <AdminSidebar /> : <AlumniSidebar />}
      <main className="min-w-0 flex-1 overflow-y-auto p-6 md:p-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <header>
            <Link href="/dashboard" className="text-sm font-medium text-[#1d5a99] hover:underline">Back to dashboard</Link>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#b68b24]">Account</p>
            <h1 className="mt-2 text-3xl font-bold text-[#16345c]">Security</h1>
          </header>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#16345c]">Change password</h2>
            <p className="mt-2 text-sm text-slate-600">Enter your current password to set a new one for this account.</p>
            <ChangePasswordForm />
          </section>
        </div>
      </main>
    </div>
  )
}
