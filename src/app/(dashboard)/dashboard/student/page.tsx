import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/alumni/sidebar'
import { AlumniTransitionForm } from '@/components/student/alumni-transition-form'
import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Student Dashboard - Alumni Management System',
}

export default async function StudentDashboardPage() {
  const user = await getActiveSessionUser()
  if (!user) redirect('/login')
  if (user.role !== 'STUDENT') redirect('/dashboard')

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    select: {
      firstName: true,
      lastName: true,
      rollNumber: true,
      admissionYear: true,
      expectedGraduationYear: true,
      hasTransitioned: true,
      department: { select: { name: true } },
    },
  })
  if (!student) redirect('/dashboard')
  if (student.hasTransitioned) redirect('/dashboard')
  const canTransition = student.expectedGraduationYear <= new Date().getFullYear()

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-6 md:p-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <header>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b68b24]">Student workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-[#16345c]">Welcome, {student.firstName}</h1>
          </header>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#16345c]">Academic details</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs text-slate-500">Department</dt><dd className="mt-1 font-medium">{student.department.name}</dd></div>
              <div><dt className="text-xs text-slate-500">Roll number</dt><dd className="mt-1 font-medium">{student.rollNumber}</dd></div>
              <div><dt className="text-xs text-slate-500">Admission year</dt><dd className="mt-1 font-medium">{student.admissionYear}</dd></div>
              <div><dt className="text-xs text-slate-500">Expected graduation</dt><dd className="mt-1 font-medium">{student.expectedGraduationYear}</dd></div>
            </dl>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#16345c]">Graduated? Transition to alumni</h2>
            <p className="mt-2 text-sm text-slate-600">
              {canTransition
                ? 'Submit your graduation details to create your alumni profile. Department staff will verify your credentials.'
                : `You can submit your graduation details after your expected graduation year (${student.expectedGraduationYear}).`}
            </p>
            {canTransition && <AlumniTransitionForm expectedGraduationYear={student.expectedGraduationYear} />}
          </section>
        </div>
      </main>
    </div>
  )
}
