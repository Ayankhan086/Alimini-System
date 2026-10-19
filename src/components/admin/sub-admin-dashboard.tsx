import {
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  Download,
  Users,
} from 'lucide-react'
import { Sidebar } from '@/components/admin/sidebar'
import { Card, CardContent } from '@/components/ui/card'

type Department = {
  id: string
  name: string
  code: string
}

type DepartmentDashboardData = {
  stats: {
    totalAlumni: number
    pendingVerifications: number
    verifiedAlumni: number
    rejectedAlumni: number
    activeMemberships: number
  }
  industryBreakdown: Array<{ name: string; count: number }>
  pendingRequests: Array<{
    firstName: string
    lastName: string
    program: string
    graduationYear: number
    user: { email: string }
  }>
}

export function SubAdminDashboard({
  department,
  data,
}: {
  department: Department
  data: DepartmentDashboardData
}) {
  const stats = [
    {
      label: 'Department alumni',
      value: data.stats.totalAlumni,
      caption: 'Profiles in your department',
      icon: Users,
      tone: 'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/50',
    },
    {
      label: 'Pending verification',
      value: data.stats.pendingVerifications,
      caption: 'Awaiting departmental review',
      icon: Clock3,
      tone: 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40',
    },
    {
      label: 'Verified alumni',
      value: data.stats.verifiedAlumni,
      caption: 'Approved department profiles',
      icon: BadgeCheck,
      tone: 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40',
    },
    {
      label: 'Active memberships',
      value: data.stats.activeMemberships,
      caption: `${data.stats.rejectedAlumni.toLocaleString()} rejected profiles`,
      icon: BriefcaseBusiness,
      tone: 'text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-950/40',
    },
  ]
  const maximumIndustryCount = Math.max(
    ...data.industryBreakdown.map(({ count }) => count),
    1
  )

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-[#0b0f19] dark:text-white">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-[#111b2c] sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-amber-300">
              Department Administration
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Sub-Admin Dashboard</h1>
          </div>
        </header>

        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <section className="flex flex-col justify-between gap-4 rounded-2xl bg-[#1a365d] p-5 text-white shadow-sm dark:bg-gradient-to-r dark:from-[#13233a] dark:to-[#1b3554] sm:flex-row sm:items-center sm:p-7">
              <div>
                <p className="text-sm font-medium text-blue-100 dark:text-slate-300">
                  {department.code} · Department overview
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  {department.name}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 dark:text-slate-300">
                  Alumni, verification activity, and employment sectors for your assigned department.
                </p>
              </div>
              <a
                href="/api/admin/reports/alumni"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#1a365d] transition-colors hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200"
              >
                <Download aria-hidden="true" className="h-4 w-4" />
                Export department report
              </a>
            </section>

            <section aria-label={`${department.name} statistics`} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ label, value, caption, icon: Icon, tone }) => (
                <Card key={label} className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <CardContent className="flex items-start justify-between gap-3 p-5">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                      <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight">{value.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{caption}</p>
                    </div>
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-2">
              <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-5 sm:p-6">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Employment sectors
                  </h2>
                  {data.industryBreakdown.length ? (
                    <ul className="mt-5 space-y-4">
                      {data.industryBreakdown.slice(0, 6).map(({ name, count }) => (
                        <li key={name}>
                          <div className="mb-1.5 flex items-center justify-between gap-4 text-sm">
                            <span className="truncate text-slate-600 dark:text-slate-300">{name}</span>
                            <span className="shrink-0 font-semibold tabular-nums text-slate-900 dark:text-white">
                              {count.toLocaleString()}
                            </span>
                          </div>
                          <div
                            className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                            role="img"
                            aria-label={`${name}: ${count} alumni`}
                          >
                            <div
                              className="h-full rounded-full bg-blue-700 dark:bg-amber-400"
                              style={{ width: `${Math.max((count / maximumIndustryCount) * 100, 3)}%` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-5 rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                      No employment sector information is available yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                  <h2 className="font-semibold">Pending verification</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Latest alumni profiles from {department.code} awaiting review.
                  </p>
                </div>
                {data.pendingRequests.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[540px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                        <tr>
                          <th scope="col" className="px-5 py-3 font-semibold">Alumnus</th>
                          <th scope="col" className="px-5 py-3 font-semibold">Program / batch</th>
                          <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.pendingRequests.map((request) => (
                          <tr key={`${request.user.email}-${request.graduationYear}`} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                            <td className="px-5 py-4">
                              <p className="font-medium text-slate-900 dark:text-white">{request.firstName} {request.lastName}</p>
                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{request.user.email}</p>
                            </td>
                            <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{request.program} · {request.graduationYear}</td>
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                Pending
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-5 py-12 text-center">
                    <p className="font-medium">No pending verifications</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      New pending profiles from your department will appear here.
                    </p>
                  </div>
                )}
              </section>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
