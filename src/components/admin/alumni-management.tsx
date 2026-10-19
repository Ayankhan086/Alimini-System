'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { Sidebar } from '@/components/admin/sidebar'
import { Card, CardContent } from '@/components/ui/card'

type AlumniRow = {
  id: string
  firstName: string
  lastName: string
  rollNumber: string
  program: string
  graduationYear: number
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  rejectionReason: string | null
  createdAt: Date
  user: { email: string; isActive: boolean }
  department: { name: string; code: string }
  membership: { status: string } | null
}

type Department = { id: string; name: string; code: string }

type Filters = {
  search: string
  status: string
  departmentId: string
  page: number
  pageCount: number
  matchingCount: number
}

function StatusBadge({ status }: { status: AlumniRow['verificationStatus'] }) {
  const style = {
    PENDING: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200',
    VERIFIED: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200',
    REJECTED: 'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-200',
  }[status]

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>
      {status === 'VERIFIED' ? 'Verified' : status === 'REJECTED' ? 'Rejected' : 'Pending'}
    </span>
  )
}

function VerificationActions({ alumniId }: { alumniId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  async function updateStatus(status: 'VERIFIED' | 'REJECTED') {
    if (isSaving) return
    setError('')
    if (status === 'REJECTED' && rejectionReason.trim().length < 5) {
      setError('Enter a rejection reason of at least 5 characters.')
      return
    }
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/alumni/${encodeURIComponent(alumniId)}/verification`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          ...(status === 'REJECTED' ? { rejectionReason } : {}),
        }),
      })
      const result: { error?: string } = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Could not update verification status.')
      startTransition(() => router.refresh())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update verification status.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={isPending || isSaving}
        onClick={() => updateStatus('VERIFIED')}
        className="inline-flex min-h-9 items-center gap-1 rounded-md border border-emerald-200 px-2.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-900 dark:text-emerald-200 dark:hover:bg-emerald-950/40"
      >
        <Check aria-hidden="true" className="h-3.5 w-3.5" />
        Approve
      </button>
      <button
        type="button"
        disabled={isPending || isSaving}
        onClick={() => updateStatus('REJECTED')}
        className="inline-flex min-h-9 items-center gap-1 rounded-md border border-red-200 px-2.5 text-xs font-semibold text-red-800 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-200 dark:hover:bg-red-950/40"
      >
        <X aria-hidden="true" className="h-3.5 w-3.5" />
        Reject
      </button>
      <label className="basis-full text-xs font-medium text-slate-600 dark:text-slate-300">
        Rejection reason
        <input
          value={rejectionReason}
          onChange={(event) => setRejectionReason(event.target.value)}
          maxLength={500}
          placeholder="Explain what needs correction"
          className="mt-1 min-h-9 w-full rounded-md border border-slate-300 px-2.5 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </label>
      {error ? <span role="alert" className="basis-full text-xs text-red-700 dark:text-red-300">{error}</span> : null}
    </div>
  )
}

function paginationHref(filters: Filters, page: number) {
  const params = new URLSearchParams()
  if (filters.search) params.set('q', filters.search)
  if (filters.status) params.set('status', filters.status)
  if (filters.departmentId) params.set('department', filters.departmentId)
  params.set('page', String(page))
  return `/dashboard/admin/alumni?${params.toString()}`
}

export function AlumniManagement({
  rows,
  filters,
  departments,
  assignedDepartment,
  stats,
}: {
  rows: AlumniRow[]
  filters: Filters
  departments: Department[]
  assignedDepartment?: Department
  stats: { total: number; pending: number; verified: number; rejected: number }
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-[#0b0f19] dark:text-white">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-[#111b2c] sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-amber-300">
              {assignedDepartment ? `${assignedDepartment.code} Department` : 'Institution-wide'}
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Alumni Management</h1>
          </div>
        </header>

        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Alumni status totals">
              {[
                ['Total alumni', stats.total, 'text-slate-900 dark:text-white'],
                ['Pending review', stats.pending, 'text-amber-700 dark:text-amber-300'],
                ['Verified', stats.verified, 'text-emerald-700 dark:text-emerald-300'],
                ['Rejected', stats.rejected, 'text-red-700 dark:text-red-300'],
              ].map(([label, value, tone]) => (
                <Card key={label} className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                    <p className={`mt-1 text-2xl font-bold tabular-nums ${tone}`}>{Number(value).toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
              <form action="/dashboard/admin/alumni" method="get" className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_minmax(170px,1fr)_minmax(200px,1fr)_auto] xl:items-end">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Search alumni
                  <span className="relative mt-1.5 block">
                    <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="q"
                      type="search"
                      defaultValue={filters.search}
                      placeholder="Name, email, roll number, program"
                      className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus-visible:ring-amber-300"
                    />
                  </span>
                </label>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Verification status
                  <select
                    name="status"
                    defaultValue={filters.status}
                    className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus-visible:ring-amber-300"
                  >
                    <option value="">All statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </label>
                {assignedDepartment ? (
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Department
                    <p className="mt-1.5 flex min-h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-950">
                      {assignedDepartment.name}
                    </p>
                  </div>
                ) : (
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Department
                    <select
                      name="department"
                      defaultValue={filters.departmentId}
                      className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus-visible:ring-amber-300"
                    >
                      <option value="">All departments</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name} ({department.code})
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <button
                  type="submit"
                  className="min-h-11 rounded-lg bg-[#1a365d] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#254a7a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200"
                >
                  Apply filters
                </button>
              </form>
            </section>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div>
                  <h2 className="font-semibold">Alumni directory</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {rows.length ? `Showing ${(filters.page - 1) * 20 + 1}–${(filters.page - 1) * 20 + rows.length}` : 'No matching records'} of {filters.matchingCount.toLocaleString()} matching alumni.
                  </p>
                </div>
              </div>
              {rows.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-semibold">Alumnus</th>
                        <th scope="col" className="px-5 py-3 font-semibold">Department</th>
                        <th scope="col" className="px-5 py-3 font-semibold">Program / batch</th>
                        <th scope="col" className="px-5 py-3 font-semibold">Verification</th>
                        <th scope="col" className="px-5 py-3 font-semibold">Membership</th>
                        <th scope="col" className="px-5 py-3 font-semibold">Review action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {rows.map((alumnus) => (
                        <tr key={alumnus.id} className="align-top hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-900 dark:text-white">{alumnus.firstName} {alumnus.lastName}</p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{alumnus.user.email}</p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Roll no. {alumnus.rollNumber}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-slate-700 dark:text-slate-200">{alumnus.department.name}</p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{alumnus.department.code}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-slate-700 dark:text-slate-200">{alumnus.program}</p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Class of {alumnus.graduationYear}</p>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={alumnus.verificationStatus} />
                            {alumnus.verificationStatus === 'REJECTED' && alumnus.rejectionReason ? (
                              <p className="mt-1 max-w-xs text-xs text-red-700 dark:text-red-300">{alumnus.rejectionReason}</p>
                            ) : null}
                            {!alumnus.user.isActive ? (
                              <p className="mt-1 text-xs font-medium text-red-700 dark:text-red-300">Account inactive</p>
                            ) : null}
                          </td>
                          <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                            {alumnus.membership?.status ?? 'Not issued'}
                          </td>
                          <td className="px-5 py-4">
                            {alumnus.verificationStatus === 'PENDING' ? (
                              <VerificationActions alumniId={alumnus.id} />
                            ) : (
                              <span className="text-xs text-slate-500 dark:text-slate-400">No action needed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-5 py-14 text-center">
                  <Search aria-hidden="true" className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-3 font-medium">No alumni found</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Try adjusting the search or filters.
                  </p>
                </div>
              )}
              <footer className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 dark:border-slate-800">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Page {filters.page} of {filters.pageCount}
                </span>
                <div className="flex items-center gap-2">
                  {filters.page > 1 ? (
                    <a
                      href={paginationHref(filters, filters.page - 1)}
                      aria-label="Previous page"
                      className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm font-medium hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft aria-hidden="true" className="h-4 w-4" /> Previous
                    </a>
                  ) : null}
                  {filters.page < filters.pageCount ? (
                    <a
                      href={paginationHref(filters, filters.page + 1)}
                      aria-label="Next page"
                      className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm font-medium hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Next <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </footer>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
