import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

function csvCell(value: string | number | Date | null) {
  let text = value instanceof Date ? value.toISOString() : String(value ?? '')
  if (/^[\s]*[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replaceAll('"', '""')}"`
}

export async function GET(request: Request) {
  const actor = await getActiveSessionUser()
  if (!actor || (actor.role !== 'SUPER_ADMIN' && actor.role !== 'SUB_ADMIN')) {
    return new Response('Forbidden', { status: 403 })
  }

  const url = new URL(request.url)
  const industry = url.searchParams.get('industry')?.trim()
  let departmentId = url.searchParams.get('department')?.trim()

  if (actor.role === 'SUB_ADMIN') {
    const assignment = await prisma.subAdmin.findUnique({
      where: { userId: actor.id },
      select: { departmentId: true },
    })
    if (!assignment) return new Response('Forbidden', { status: 403 })
    departmentId = assignment.departmentId
  }

  const filters: Prisma.AlumniWhereInput = {
    ...(departmentId ? { departmentId } : {}),
    ...(industry ? { industry } : {}),
  }

  const alumni = await prisma.alumni.findMany({
    where: filters,
    select: {
      firstName: true,
      lastName: true,
      user: { select: { email: true } },
      department: { select: { name: true } },
      program: true,
      degreeLevel: true,
      graduationYear: true,
      verificationStatus: true,
      industry: true,
      currentEmployer: true,
      jobTitle: true,
      city: true,
      country: true,
      createdAt: true,
    },
    orderBy: [{ department: { name: 'asc' } }, { lastName: 'asc' }, { firstName: 'asc' }],
  })

  const rows = [
    [
      'First name',
      'Last name',
      'Email',
      'Department',
      'Program',
      'Degree level',
      'Graduation year',
      'Verification status',
      'Employment sector',
      'Employer',
      'Job title',
      'City',
      'Country',
      'Registered at',
    ],
    ...alumni.map((person) => [
      person.firstName,
      person.lastName,
      person.user.email,
      person.department.name,
      person.program,
      person.degreeLevel,
      person.graduationYear,
      person.verificationStatus,
      person.industry,
      person.currentEmployer,
      person.jobTitle,
      person.city,
      person.country,
      person.createdAt,
    ]),
  ]
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="uetmaa-${actor.role === 'SUB_ADMIN' ? 'department-' : ''}alumni-report.csv"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
