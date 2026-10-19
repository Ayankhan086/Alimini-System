import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/alumni/sidebar'
import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Alumni Directory - Alumni Management System',
}

type DirectorySearchParams = {
  q?: string | string[]
  department?: string | string[]
  page?: string | string[]
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function AlumniDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<DirectorySearchParams>
}) {
  const user = await getActiveSessionUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const query = (firstValue(params.q) ?? '').trim().slice(0, 80)
  const departmentId = firstValue(params.department) ?? ''
  const pageValue = Number.parseInt(firstValue(params.page) ?? '1', 10)
  const requestedPage = Number.isFinite(pageValue) ? Math.max(1, pageValue) : 1
  const pageSize = 24
  const where = {
    verificationStatus: 'VERIFIED' as const,
    showInDirectory: true,
    ...(departmentId ? { departmentId } : {}),
    ...(query
      ? {
          OR: [
            { firstName: { contains: query, mode: 'insensitive' as const } },
            { lastName: { contains: query, mode: 'insensitive' as const } },
            { program: { contains: query, mode: 'insensitive' as const } },
            { industry: { contains: query, mode: 'insensitive' as const } },
            { department: { name: { contains: query, mode: 'insensitive' as const } } },
          ],
        }
      : {}),
  }

  const [total, departments] = await Promise.all([
    prisma.alumni.count({ where }),
    prisma.department.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(requestedPage, pageCount)
  const alumni = await prisma.alumni.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      program: true,
      graduationYear: true,
      industry: true,
      city: true,
      country: true,
      phone: true,
      showPhone: true,
      showEmail: true,
      department: { select: { name: true } },
      user: { select: { email: true } },
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    skip: (page - 1) * pageSize,
    take: pageSize,
  })
  const previousQuery = new URLSearchParams()
  if (query) previousQuery.set('q', query)
  if (departmentId) previousQuery.set('department', departmentId)
  previousQuery.set('page', String(Math.max(1, page - 1)))
  const nextQuery = new URLSearchParams(previousQuery)
  nextQuery.set('page', String(Math.min(pageCount, page + 1)))

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-6 md:p-10">
        <div className="mx-auto max-w-7xl space-y-7">
          <header>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b68b24]">UET Mardan Alumni Association</p>
            <h1 className="mt-2 text-3xl font-bold text-[#16345c]">Alumni Directory</h1>
            <p className="mt-2 text-sm text-slate-600">Find verified alumni who have chosen to be visible in the directory.</p>
          </header>

          <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_260px_auto]">
            <label className="sr-only" htmlFor="directory-query">Search alumni</label>
            <input
              id="directory-query"
              name="q"
              defaultValue={query}
              placeholder="Search by name, department, program, or industry"
              className="h-11 rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-[#16345c] focus:ring-2 focus:ring-[#16345c]/15"
            />
            <label className="sr-only" htmlFor="directory-department">Filter by department</label>
            <select
              id="directory-department"
              name="department"
              defaultValue={departmentId}
              className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#16345c] focus:ring-2 focus:ring-[#16345c]/15"
            >
              <option value="">All departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>{department.name}</option>
              ))}
            </select>
            <button className="h-11 rounded-md bg-[#16345c] px-5 text-sm font-semibold text-white hover:bg-[#214779]">Search</button>
          </form>

          <div className="flex items-center justify-between text-sm text-slate-600">
            <p>{total} verified {total === 1 ? 'alumnus' : 'alumni'} listed</p>
            <p>Page {page} of {pageCount}</p>
          </div>

          {alumni.length ? (
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {alumni.map((person) => (
                <li key={person.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-bold text-[#16345c]">{person.firstName} {person.lastName}</h2>
                  <p className="mt-1 text-sm text-slate-600">{person.program} · Class of {person.graduationYear}</p>
                  <p className="mt-3 text-sm font-medium text-slate-800">{person.department.name}</p>
                  {person.industry && <p className="mt-1 text-sm text-slate-600">{person.industry}</p>}
                  {(person.city || person.country) && (
                    <p className="mt-1 text-sm text-slate-600">{[person.city, person.country].filter(Boolean).join(', ')}</p>
                  )}
                  <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-sm">
                    {person.showEmail && <p><span className="font-medium text-slate-700">Email:</span> <a className="text-[#1d5a99] hover:underline" href={`mailto:${person.user.email}`}>{person.user.email}</a></p>}
                    {person.showPhone && person.phone && <p><span className="font-medium text-slate-700">Phone:</span> <a className="text-[#1d5a99] hover:underline" href={`tel:${person.phone}`}>{person.phone}</a></p>}
                    {!person.showEmail && !person.showPhone && <p className="text-slate-500">Contact details are private.</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h2 className="font-semibold text-[#16345c]">No alumni found</h2>
              <p className="mt-2 text-sm text-slate-600">Try another search term or department.</p>
            </div>
          )}

          {pageCount > 1 && (
            <nav className="flex justify-between" aria-label="Directory pages">
              {page > 1
                ? <Link className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-[#16345c]" href={`/dashboard/directory?${previousQuery}`}>Previous</Link>
                : <span />}
              {page < pageCount && <Link className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-[#16345c]" href={`/dashboard/directory?${nextQuery}`}>Next</Link>}
            </nav>
          )}
        </div>
      </main>
    </div>
  )
}
