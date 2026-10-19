import { NextResponse } from 'next/server'
import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getActiveSessionUser()
  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [users, departments, requests] = await Promise.all([
    prisma.user.findMany({
      take: 200,
      orderBy: [{ createdAt: 'desc' }],
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        alumni: { select: { firstName: true, lastName: true } },
        student: { select: { firstName: true, lastName: true } },
        faculty: {
          select: {
            firstName: true,
            lastName: true,
            department: { select: { name: true } },
          },
        },
        subAdmin: { select: { department: { select: { name: true } } } },
      },
    }),
    prisma.department.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.subAdminRequest.findMany({
      where: { status: 'PENDING' },
      take: 100,
      orderBy: { submittedAt: 'asc' },
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

  return NextResponse.json({
    users,
    departments,
    requests: requests.map((request) => ({
      ...request,
      departmentName: departments.find(({ id }) => id === request.departmentId)?.name ?? 'Unknown department',
    })),
  })
}
