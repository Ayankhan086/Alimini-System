import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'

const transitionSchema = z.object({
  degreeLevel: z.string().trim().min(2).max(50),
  program: z.string().trim().min(2).max(100),
  graduationYear: z.number().int().min(2000).max(new Date().getFullYear()),
  cnic: z.string().trim().regex(/^[0-9]{5}-[0-9]{7}-[0-9]$/).optional().or(z.literal('')),
})

export async function POST(request: Request) {
  const user = await getActiveSessionUser()
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Only active students can request alumni transition.' }, { status: 403 })
  }

  const parsed = transitionSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid transition details.' }, { status: 400 })
  }

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      userId: true,
      departmentId: true,
      rollNumber: true,
      admissionYear: true,
      expectedGraduationYear: true,
      phone: true,
      avatarUrl: true,
      hasTransitioned: true,
    },
  })
  if (!student) return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 })
  if (student.hasTransitioned) {
    return NextResponse.json({ error: 'This student account has already transitioned.' }, { status: 409 })
  }
  if (student.expectedGraduationYear > new Date().getFullYear()) {
    return NextResponse.json({ error: 'You can request alumni transition after your expected graduation year.' }, { status: 409 })
  }

  const data = parsed.data
  if (data.graduationYear < student.expectedGraduationYear) {
    return NextResponse.json({ error: 'Graduation year cannot be earlier than your expected graduation year.' }, { status: 400 })
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.alumni.create({
        data: {
          userId: student.userId,
          departmentId: student.departmentId,
          firstName: student.firstName,
          lastName: student.lastName,
          phone: student.phone,
          avatarUrl: student.avatarUrl,
          degreeLevel: data.degreeLevel,
          program: data.program,
          admissionYear: student.admissionYear,
          graduationYear: data.graduationYear,
          rollNumber: student.rollNumber,
          cnic: data.cnic || null,
          transitionedFromStudentId: student.id,
          verificationStatus: 'PENDING',
        },
      })
      await tx.student.update({
        where: { id: student.id },
        data: { hasTransitioned: true },
      })
      await tx.user.update({
        where: { id: student.userId },
        data: { role: 'ALUMNI' },
      })
    }, { isolationLevel: 'Serializable' })
  } catch (error) {
    console.error('[STUDENT_ALUMNI_TRANSITION_ERROR]', error)
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'An alumni profile already exists for this student or the CNIC is already registered.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'The transition could not be completed due to a server error. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Your alumni profile is now awaiting departmental verification.' })
}
