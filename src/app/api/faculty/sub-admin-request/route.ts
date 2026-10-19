import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'

const requestSchema = z.object({
  reason: z.string().trim().min(20, 'Explain why you are requesting sub-admin access (at least 20 characters).').max(1000),
})

export async function POST(request: Request) {
  const user = await getActiveSessionUser()
  if (!user || user.role !== 'FACULTY') {
    return NextResponse.json({ error: 'Only active faculty accounts can request sub-admin access.' }, { status: 403 })
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 })
  }

  const faculty = await prisma.faculty.findUnique({
    where: { userId: user.id },
    select: { id: true, departmentId: true, isSubAdmin: true },
  })
  if (!faculty) return NextResponse.json({ error: 'Faculty profile not found.' }, { status: 404 })
  if (faculty.isSubAdmin) return NextResponse.json({ error: 'You already have sub-admin access.' }, { status: 409 })

  try {
    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.subAdmin.findUnique({
        where: { departmentId: faculty.departmentId },
        select: { id: true },
      })
      if (assignment) return { error: 'This department already has an active sub-admin.' }
      const pendingRequest = await tx.subAdminRequest.findFirst({
        where: { facultyId: faculty.id, status: 'PENDING' },
        select: { id: true },
      })
      if (pendingRequest) return { error: 'You already have a request awaiting review.' }

      const createdRequest = await tx.subAdminRequest.create({
        data: {
          facultyId: faculty.id,
          departmentId: faculty.departmentId,
          reason: parsed.data.reason,
        },
        select: { id: true, status: true, submittedAt: true },
      })
      return { request: createdRequest }
    }, { isolationLevel: 'Serializable' })
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: 409 })
    return NextResponse.json({ request: result.request }, { status: 201 })
  } catch (error) {
    console.error('[SUB_ADMIN_REQUEST_CREATE_ERROR]', error)
    return NextResponse.json({ error: 'The request could not be saved. Refresh and try again.' }, { status: 409 })
  }
}
