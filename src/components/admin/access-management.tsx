'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type AccessUser = {
  id: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  name: string
  department: string
}

type SubAdminRequest = {
  id: string
  reason: string
  submittedAt: string
  department: string
  facultyName: string
  email: string
  designation: string
}

type DepartmentOption = { id: string; name: string }

export function AccessManagement({
  currentUserId,
  users,
  departments,
  requests,
}: {
  currentUserId: string
  users: AccessUser[]
  departments: DepartmentOption[]
  requests: SubAdminRequest[]
}) {
  const router = useRouter()
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({})

  async function sendAction(url: string, body: Record<string, unknown>) {
    setError('')
    setNotice('')
    setBusyId(url)
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'The requested action failed.')
      setNotice('Changes saved.')
      router.refresh()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'The requested action failed.')
    } finally {
      setBusyId('')
    }
  }

  async function createFaculty(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setNotice('')
    setBusyId('create-faculty')
    const form = event.currentTarget
    const values = new FormData(form)
    const body = Object.fromEntries(values.entries())
    try {
      const response = await fetch('/api/admin/access/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Faculty account creation failed.')
      form.reset()
      setNotice('Faculty account created. Share the initial password with the faculty member through a secure channel.')
      router.refresh()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Faculty account creation failed.')
    } finally {
      setBusyId('')
    }
  }

  const visibleUsers = users.filter((account) => {
    const value = `${account.name} ${account.email} ${account.role} ${account.department}`.toLowerCase()
    return value.includes(search.trim().toLowerCase())
  })

  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc] p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b68b24]">Administration</p>
          <h1 className="mt-2 text-3xl font-bold text-[#16345c]">User & access management</h1>
          <p className="mt-2 text-sm text-slate-600">Manage faculty accounts, account access, and department sub-admin approvals.</p>
        </header>

        {(error || notice) && (
          <div role={error ? 'alert' : 'status'} className={`rounded-lg border p-3 text-sm ${error ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
            {error || notice}
          </div>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#16345c]">Create faculty account</h2>
          <p className="mt-1 text-sm text-slate-600">Faculty can apply for sub-admin privileges; this does not grant admin access by itself.</p>
          <form onSubmit={createFaculty} className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="space-y-1 text-sm font-medium text-slate-700">First name<input required minLength={2} maxLength={50} name="firstName" className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3" /></label>
            <label className="space-y-1 text-sm font-medium text-slate-700">Last name<input required minLength={2} maxLength={50} name="lastName" className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3" /></label>
            <label className="space-y-1 text-sm font-medium text-slate-700">Email<input required type="email" autoComplete="email" name="email" className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3" /></label>
            <label className="space-y-1 text-sm font-medium text-slate-700">Initial password<input required type="password" minLength={12} maxLength={100} autoComplete="new-password" name="password" className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3" /><span className="block text-xs font-normal text-slate-500">At least 12 characters; communicate it securely.</span></label>
            <label className="space-y-1 text-sm font-medium text-slate-700">Department<select required name="departmentId" defaultValue="" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3"><option value="" disabled>Select department</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></label>
            <label className="space-y-1 text-sm font-medium text-slate-700">Designation<input required minLength={2} maxLength={100} name="designation" placeholder="e.g. Associate Professor" className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3" /></label>
            <label className="space-y-1 text-sm font-medium text-slate-700">Phone (optional)<input name="phone" type="tel" className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3" /></label>
            <div className="flex items-end"><button disabled={busyId === 'create-faculty'} className="h-10 rounded-md bg-[#16345c] px-5 font-semibold text-white hover:bg-[#214779] disabled:opacity-60">{busyId === 'create-faculty' ? 'Creating…' : 'Create faculty account'}</button></div>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#16345c]">Sub-admin requests</h2>
              <p className="mt-1 text-sm text-slate-600">Approving one faculty member automatically closes competing pending requests in that department.</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">{requests.length} pending</span>
          </div>
          {requests.length ? (
            <ul className="mt-5 divide-y divide-slate-100">
              {requests.map((request) => (
                <li key={request.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{request.facultyName} <span className="font-normal text-slate-500">· {request.designation}</span></h3>
                      <p className="mt-1 text-sm text-slate-600">{request.email} · {request.department} · Submitted {new Date(request.submittedAt).toLocaleDateString()}</p>
                      <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm text-slate-700">{request.reason}</p>
                    </div>
                    <div className="flex gap-2">
                      <button disabled={busyId === `/api/admin/access/sub-admin-requests/${request.id}`} onClick={() => sendAction(`/api/admin/access/sub-admin-requests/${request.id}`, { decision: 'APPROVED' })} className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Approve</button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <input
                      value={rejectionReasons[request.id] ?? ''}
                      onChange={(event) => setRejectionReasons((current) => ({ ...current, [request.id]: event.target.value }))}
                      placeholder="Reason required to reject"
                      maxLength={500}
                      aria-label={`Rejection reason for ${request.facultyName}`}
                      className="min-w-64 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button
                      disabled={busyId === `/api/admin/access/sub-admin-requests/${request.id}` || !rejectionReasons[request.id]?.trim()}
                      onClick={() => sendAction(`/api/admin/access/sub-admin-requests/${request.id}`, { decision: 'REJECTED', rejectionReason: rejectionReasons[request.id] })}
                      className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
                    >Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="mt-5 rounded-lg bg-slate-50 p-5 text-sm text-slate-600">There are no pending requests.</p>}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#16345c]">Accounts</h2>
              <p className="mt-1 text-sm text-slate-600">Showing the most recent {users.length} accounts.</p>
            </div>
            <label className="text-sm font-medium text-slate-700">Filter accounts<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, role, department" className="mt-1 block h-10 w-72 max-w-full rounded-md border border-slate-300 px-3" /></label>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><tr><th className="py-3 pr-4">Name / email</th><th className="py-3 pr-4">Role</th><th className="py-3 pr-4">Department</th><th className="py-3 pr-4">Status</th><th className="py-3 pr-4">Created</th><th className="py-3">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {visibleUsers.map((account) => (
                  <tr key={account.id}>
                    <td className="py-3 pr-4"><p className="font-medium text-slate-900">{account.name}</p><p className="text-xs text-slate-500">{account.email}</p></td>
                    <td className="py-3 pr-4">{account.role.replace('_', ' ')}</td>
                    <td className="py-3 pr-4">{account.department}</td>
                    <td className="py-3 pr-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${account.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{account.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="py-3 pr-4">{new Date(account.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {account.id !== currentUserId && <button disabled={busyId === `/api/admin/access/users/${account.id}`} onClick={() => sendAction(`/api/admin/access/users/${account.id}`, { action: 'SET_ACTIVE', isActive: !account.isActive })} className="rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-[#16345c] disabled:opacity-50">{account.isActive ? account.role === 'SUB_ADMIN' ? 'Deactivate & demote' : 'Deactivate' : 'Reactivate'}</button>}
                        {account.role === 'SUB_ADMIN' && <button disabled={busyId === `/api/admin/access/users/${account.id}`} onClick={() => sendAction(`/api/admin/access/users/${account.id}`, { action: 'DEMOTE_SUB_ADMIN' })} className="rounded border border-amber-300 px-2.5 py-1.5 text-xs font-semibold text-amber-900 disabled:opacity-50">Demote</button>}
                      </div>
                    </td>
                  </tr>
                ))}
                {!visibleUsers.length && <tr><td colSpan={6} className="py-8 text-center text-slate-500">No accounts match this filter.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
