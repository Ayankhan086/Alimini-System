import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'

const facultySchema = z.object({
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(50),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(12).max(100),
  departmentId: z.string().min(1),
  designation: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^\+?[0-9]{10,15}$/).optional().or(z.literal('')),
})

export async function POST(request: Request) {
  const actor = await getActiveSessionUser()
  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const parsed = facultySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid faculty details.' }, { status: 400 })
  }
  const data = parsed.data

  const [existingUser, department] = await Promise.all([
    prisma.user.findUnique({ where: { email: data.email }, select: { id: true } }),
    prisma.department.findUnique({ where: { id: data.departmentId }, select: { id: true } }),
  ])
  if (existingUser) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  if (!department) return NextResponse.json({ error: 'Choose a valid department.' }, { status: 400 })

  const passwordHash = await bcrypt.hash(data.password, 12)
  try {
    const faculty = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: { email: data.email, passwordHash, role: 'FACULTY' },
      })
      const createdFaculty = await tx.faculty.create({
        data: {
          userId: createdUser.id,
          departmentId: data.departmentId,
          firstName: data.firstName,
          lastName: data.lastName,
          designation: data.designation,
          phone: data.phone || null,
        },
        select: { id: true, firstName: true, lastName: true },
      })
      await tx.auditLog.create({
        data: {
          performedById: actor.id,
          action: 'USER_CREATED',
          targetType: 'Faculty',
          targetId: createdFaculty.id,
          details: { userId: createdUser.id, email: data.email, departmentId: data.departmentId },
        },
      })
      return createdFaculty
    })
    return NextResponse.json({ faculty }, { status: 201 })
  } catch (error) {
    console.error('[FACULTY_CREATE_ERROR]', error)
    return NextResponse.json({ error: 'Faculty account could not be created.' }, { status: 500 })
  }
}
