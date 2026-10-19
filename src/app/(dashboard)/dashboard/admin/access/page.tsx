import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AccessManagement } from '@/components/admin/access-management'
import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'User & Access Management - Alumni Management System',
}

export default async function AccessManagementPage() {
  const user = await getActiveSessionUser()
  if (!user) redirect('/login')
  if (user.role !== 'SUPER_ADMIN') redirect('/dashboard')

  const [users, departments, requests] = await Promise.all([
    prisma.user.findMany({
      take: 200,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        alumni: { select: { firstName: true, lastName: true } },
        student: { select: { firstName: true, lastName: true } },
        faculty: { select: { firstName: true, lastName: true, department: { select: { name: true } } } },
        subAdmin: { select: { department: { select: { name: true } } } },
      },
    }),
    prisma.department.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.subAdminRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { submittedAt: 'asc' },
      take: 100,
      select: {
        id: true,
        reason: true,
        submittedAt: true,
        departmentId: true,
        faculty: {
          select: {
            firstName: true,
            lastName: true,
            designation: true,
            user: { select: { email: true } },
          },
        },
      },
    }),
  ])

  return (
    <AccessManagement
      currentUserId={user.id}
      users={users.map((item) => ({
        id: item.id,
        email: item.email,
        role: item.role,
        isActive: item.isActive,
        createdAt: item.createdAt.toISOString(),
        name: item.alumni
          ? `${item.alumni.firstName} ${item.alumni.lastName}`
          : item.student
            ? `${item.student.firstName} ${item.student.lastName}`
            : item.faculty
              ? `${item.faculty.firstName} ${item.faculty.lastName}`
              : item.email,
        department: item.subAdmin?.department.name ?? item.faculty?.department.name ?? '—',
      }))}
      departments={departments}
      requests={requests.map((request) => ({
        id: request.id,
        reason: request.reason,
        submittedAt: request.submittedAt.toISOString(),
        department: departments.find(({ id }) => id === request.departmentId)?.name ?? 'Unknown department',
        facultyName: `${request.faculty.firstName} ${request.faculty.lastName}`,
        email: request.faculty.user.email,
        designation: request.faculty.designation,
      }))}
    />
  )
}
