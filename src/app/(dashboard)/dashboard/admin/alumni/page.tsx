import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getActiveSessionUser } from '@/lib/active-session'
import { AlumniManagement } from '@/components/admin/alumni-management'
import type { Prisma, VerificationStatus } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Alumni Management - Alumni Management System',
}

type AlumniManagementPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const pageSize = 20
const verificationStatuses: VerificationStatus[] = ['PENDING', 'VERIFIED', 'REJECTED']

export default async function AlumniManagementPage({ searchParams }: AlumniManagementPageProps) {
  const user = await getActiveSessionUser()
  if (!user) redirect('/login')
  if (user.role !== 'SUPER_ADMIN' && user.role !== 'SUB_ADMIN') {
    redirect('/dashboard')
  }

  const params = await searchParams
  const requestedSearch = typeof params.q === 'string' ? params.q.trim().slice(0, 100) : ''
  const requestedStatus = typeof params.status === 'string' ? params.status : ''
  const requestedDepartment = typeof params.department === 'string' ? params.department : ''
  const requestedPage = typeof params.page === 'string' ? Number(params.page) : 1
  const currentPage = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1

  let assignedDepartmentId: string | undefined
  let assignedDepartment: { id: string; name: string; code: string } | undefined
  if (user.role === 'SUB_ADMIN') {
    const assignment = await prisma.subAdmin.findUnique({
      where: { userId: user.id },
      select: { departmentId: true, department: { select: { id: true, name: true, code: true } } },
    })
    if (!assignment) notFound()
    assignedDepartmentId = assignment.departmentId
    assignedDepartment = assignment.department
  }

  const departments = user.role === 'SUPER_ADMIN'
    ? await prisma.department.findMany({
        select: { id: true, name: true, code: true },
        orderBy: { name: 'asc' },
      })
    : []

  const selectedDepartmentId = assignedDepartmentId
    ?? (departments.some(({ id }) => id === requestedDepartment) ? requestedDepartment : undefined)
  const verificationStatus = verificationStatuses.includes(requestedStatus as VerificationStatus)
    ? requestedStatus as VerificationStatus
    : undefined
  const searchFilter: Prisma.AlumniWhereInput | undefined = requestedSearch
    ? {
        OR: [
          { firstName: { contains: requestedSearch, mode: 'insensitive' } },
          { lastName: { contains: requestedSearch, mode: 'insensitive' } },
          { rollNumber: { contains: requestedSearch, mode: 'insensitive' } },
          { program: { contains: requestedSearch, mode: 'insensitive' } },
          { user: { email: { contains: requestedSearch, mode: 'insensitive' } } },
        ],
      }
    : undefined
  const where: Prisma.AlumniWhereInput = {
    ...(selectedDepartmentId ? { departmentId: selectedDepartmentId } : {}),
    ...(verificationStatus ? { verificationStatus } : {}),
    ...(searchFilter ? { AND: [searchFilter] } : {}),
  }

  const [total, pendingCount, verifiedCount, rejectedCount, matchingCount] = await Promise.all([
    prisma.alumni.count({
      where: selectedDepartmentId ? { departmentId: selectedDepartmentId } : undefined,
    }),
    prisma.alumni.count({
      where: {
        ...(selectedDepartmentId ? { departmentId: selectedDepartmentId } : {}),
        verificationStatus: 'PENDING',
      },
    }),
    prisma.alumni.count({
      where: {
        ...(selectedDepartmentId ? { departmentId: selectedDepartmentId } : {}),
        verificationStatus: 'VERIFIED',
      },
    }),
    prisma.alumni.count({
      where: {
        ...(selectedDepartmentId ? { departmentId: selectedDepartmentId } : {}),
        verificationStatus: 'REJECTED',
      },
    }),
    prisma.alumni.count({ where }),
  ])
  const pageCount = Math.max(1, Math.ceil(matchingCount / pageSize))
  const page = Math.min(currentPage, pageCount)

  const alumni = await prisma.alumni.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      rollNumber: true,
      program: true,
      graduationYear: true,
      verificationStatus: true,
      rejectionReason: true,
      createdAt: true,
      user: { select: { email: true, isActive: true } },
      department: { select: { name: true, code: true } },
      membership: { select: { status: true } },
    },
    orderBy: [{ createdAt: 'desc' }, { lastName: 'asc' }],
    skip: (page - 1) * pageSize,
    take: pageSize,
  })

  return (
    <AlumniManagement
      rows={alumni}
      filters={{
        search: requestedSearch,
        status: verificationStatus ?? '',
        departmentId: selectedDepartmentId ?? '',
        page,
        pageCount,
        matchingCount,
      }}
      departments={departments}
      assignedDepartment={assignedDepartment}
      stats={{ total, pending: pendingCount, verified: verifiedCount, rejected: rejectedCount }}
    />
  )
}
