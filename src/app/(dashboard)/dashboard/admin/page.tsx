import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getActiveSessionUser } from '@/lib/active-session'
import { SuperAdminDashboard } from '@/components/admin/super-admin-dashboard'
import { SubAdminDashboard } from '@/components/admin/sub-admin-dashboard'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Alumni Management System',
}

type AdminDashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const user = await getActiveSessionUser()

  if (!user) {
    redirect('/login')
  }

  const role = user.role
  if (role !== 'SUPER_ADMIN' && role !== 'SUB_ADMIN') {
    redirect('/dashboard')
  }

  if (role === 'SUPER_ADMIN') {
    const params = await searchParams
    const requestedDepartmentId = typeof params.department === 'string' ? params.department : ''
    const requestedIndustry = typeof params.industry === 'string' ? params.industry : ''
    const [departments, industryRows] = await Promise.all([
      prisma.department.findMany({
        select: { id: true, name: true, code: true },
        orderBy: { name: 'asc' },
      }),
      prisma.alumni.findMany({
        where: { industry: { not: null } },
        select: { industry: true },
        distinct: ['industry'],
        orderBy: { industry: 'asc' },
      }),
    ])
    const departmentId = departments.some(({ id }) => id === requestedDepartmentId)
      ? requestedDepartmentId
      : ''
    const industries = industryRows
      .map(({ industry }) => industry?.trim())
      .filter((industry): industry is string => Boolean(industry))
    const industry = industries.includes(requestedIndustry) ? requestedIndustry : ''
    const filters: Prisma.AlumniWhereInput = {
      ...(departmentId ? { departmentId } : {}),
      ...(industry ? { industry } : {}),
    }
    const [
      totalAlumni,
      pendingVerifications,
      verifiedAlumni,
      rejectedAlumni,
      activeMemberships,
      departmentCounts,
      industryCounts,
      pendingRequests,
    ] = await Promise.all([
      prisma.alumni.count({ where: filters }),
      prisma.alumni.count({ where: { ...filters, verificationStatus: 'PENDING' } }),
      prisma.alumni.count({ where: { ...filters, verificationStatus: 'VERIFIED' } }),
      prisma.alumni.count({ where: { ...filters, verificationStatus: 'REJECTED' } }),
      prisma.membership.count({
        where: {
          status: 'ACTIVE',
          alumni: filters,
        },
      }),
      prisma.alumni.groupBy({
        by: ['departmentId'],
        where: filters,
        _count: { _all: true },
        orderBy: { _count: { departmentId: 'desc' } },
      }),
      prisma.alumni.groupBy({
        by: ['industry'],
        where: {
          ...filters,
          AND: [
            { industry: { not: null } },
            { industry: { not: '' } },
          ],
        },
        _count: { _all: true },
        orderBy: { _count: { industry: 'desc' } },
      }),
      prisma.alumni.findMany({
        where: { ...filters, verificationStatus: 'PENDING' },
        select: {
          firstName: true,
          lastName: true,
          program: true,
          graduationYear: true,
          user: { select: { email: true } },
          department: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
    ])

    return (
      <SuperAdminDashboard
        data={{
          filters: { departmentId, industry },
          departments,
          industries,
          stats: {
            totalAlumni,
            pendingVerifications,
            verifiedAlumni,
            rejectedAlumni,
            activeMemberships,
          },
          departmentBreakdown: departmentCounts.map(({ departmentId: id, _count }) => ({
            id,
            name: departments.find((department) => department.id === id)?.name ?? 'Unknown department',
            count: _count._all,
          })),
          industryBreakdown: industryCounts.flatMap(({ industry: name, _count }) =>
            name ? [{ name, count: _count._all }] : []
          ),
          pendingRequests,
        }}
      />
    )
  }

  if (role === 'SUB_ADMIN') {
    const assignment = await prisma.subAdmin.findUnique({
      where: { userId: user.id },
      select: {
        departmentId: true,
        department: {
          select: { id: true, name: true, code: true },
        },
      },
    })

    if (!assignment) notFound()

    const departmentId = assignment.departmentId
    const [
      totalAlumni,
      pendingVerifications,
      verifiedAlumni,
      rejectedAlumni,
      activeMemberships,
      industryCounts,
      pendingRequests,
    ] = await Promise.all([
      prisma.alumni.count({ where: { departmentId } }),
      prisma.alumni.count({ where: { departmentId, verificationStatus: 'PENDING' } }),
      prisma.alumni.count({ where: { departmentId, verificationStatus: 'VERIFIED' } }),
      prisma.alumni.count({ where: { departmentId, verificationStatus: 'REJECTED' } }),
      prisma.membership.count({
        where: {
          status: 'ACTIVE',
          alumni: { departmentId },
        },
      }),
      prisma.alumni.groupBy({
        by: ['industry'],
        where: {
          departmentId,
          AND: [
            { industry: { not: null } },
            { industry: { not: '' } },
          ],
        },
        _count: { _all: true },
        orderBy: { _count: { industry: 'desc' } },
      }),
      prisma.alumni.findMany({
        where: { departmentId, verificationStatus: 'PENDING' },
        select: {
          firstName: true,
          lastName: true,
          program: true,
          graduationYear: true,
          user: { select: { email: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
    ])

    return (
      <SubAdminDashboard
        department={assignment.department}
        data={{
          stats: {
            totalAlumni,
            pendingVerifications,
            verifiedAlumni,
            rejectedAlumni,
            activeMemberships,
          },
          industryBreakdown: industryCounts.flatMap(({ industry, _count }) =>
            industry ? [{ name: industry, count: _count._all }] : []
          ),
          pendingRequests,
        }}
      />
    )
  }

  notFound()
}