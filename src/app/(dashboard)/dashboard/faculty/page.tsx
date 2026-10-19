import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/alumni/sidebar'
import { SubAdminRequestForm } from '@/components/faculty/sub-admin-request-form'
import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Faculty Dashboard - Alumni Management System',
}

export default async function FacultyDashboardPage() {
  const user = await getActiveSessionUser()
  if (!user) redirect('/login')
  if (user.role !== 'FACULTY') redirect('/dashboard')

  const faculty = await prisma.faculty.findUnique({
    where: { userId: user.id },
    select: {
      firstName: true,
      lastName: true,
      designation: true,
      isSubAdmin: true,
      department: { select: { name: true } },
      subAdminRequests: {
        take: 1,
        orderBy: { submittedAt: 'desc' },
        select: { status: true, reason: true, rejectionReason: true, submittedAt: true },
      },
    },
  })
  if (!faculty) {
    return <main className="p-10 text-slate-700">Faculty profile not found. Contact the system administrator.</main>
  }

  const latestRequest = faculty.subAdminRequests[0]

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-6 md:p-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <header>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b68b24]">Faculty workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-[#16345c]">Welcome, {faculty.firstName}</h1>
            <p className="mt-2 text-sm text-slate-600">{faculty.designation} · {faculty.department.name}</p>
          </header>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#16345c]">Department sub-admin access</h2>
            {faculty.isSubAdmin ? (
              <p className="mt-3 text-sm text-emerald-800">Your account has sub-admin privileges for {faculty.department.name}. Sign out and back in if your current session has not refreshed yet.</p>
            ) : latestRequest?.status === 'PENDING' ? (
              <div className="mt-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Your request is awaiting super-admin review.</p>
                <p className="mt-2 whitespace-pre-wrap">{latestRequest.reason}</p>
                <p className="mt-2 text-xs">Submitted {latestRequest.submittedAt.toLocaleDateString()}</p>
              </div>
            ) : (
              <>
                {latestRequest?.status === 'REJECTED' && (
                  <p className="mt-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                    Your previous request was not approved.{latestRequest.rejectionReason ? ` Reason: ${latestRequest.rejectionReason}` : ''}
                  </p>
                )}
                <div className="mt-4"><SubAdminRequestForm /></div>
              </>
            )}
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-[#16345c]">What sub-admin access includes</h2>
            <p className="mt-2 text-sm text-slate-600">If approved, you will be able to manage alumni for this department only. Super-admin approval is required, and each department can have only one active sub-admin.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
