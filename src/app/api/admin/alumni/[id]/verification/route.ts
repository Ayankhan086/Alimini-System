import { NextResponse } from 'next/server'
import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const verificationUpdateSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED']),
  rejectionReason: z.string().trim().min(5).max(500).optional(),
}).superRefine((value, context) => {
  if (value.status === 'REJECTED' && !value.rejectionReason) {
    context.addIssue({
      code: 'custom',
      path: ['rejectionReason'],
      message: 'Provide a reason when rejecting an alumni profile.',
    })
  }
})

export async function PATCH(request: Request, context: RouteContext<'/api/admin/alumni/[id]/verification'>) {
  const actor = await getActiveSessionUser()
  if (!actor || (actor.role !== 'SUPER_ADMIN' && actor.role !== 'SUB_ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params
  const body = await request.json().catch(() => null)
  const parsed = verificationUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Choose a valid verification action.' }, { status: 400 })
  }

  let departmentId: string | undefined
  if (actor.role === 'SUB_ADMIN') {
    const assignment = await prisma.subAdmin.findUnique({
      where: { userId: actor.id },
      select: { departmentId: true },
    })
    if (!assignment) return NextResponse.json({ error: 'Department assignment not found.' }, { status: 403 })
    departmentId = assignment.departmentId
  }

  const alumni = await prisma.alumni.findFirst({
    where: {
      id,
      ...(departmentId ? { departmentId } : {}),
    },
    select: {
      id: true,
      graduationYear: true,
      verificationStatus: true,
      user: { select: { isActive: true } },
    },
  })
  if (!alumni) return NextResponse.json({ error: 'Alumni record not found.' }, { status: 404 })
  if (!alumni.user.isActive) return NextResponse.json({ error: 'Reactivate the alumni account before reviewing its profile.' }, { status: 409 })
  if (alumni.verificationStatus !== 'PENDING') {
    return NextResponse.json({ error: 'Only pending profiles can be reviewed.' }, { status: 409 })
  }

  const reviewedAt = new Date()
  const status = parsed.data.status
  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.alumni.updateMany({
      where: {
        id,
        verificationStatus: 'PENDING',
        ...(departmentId ? { departmentId } : {}),
      },
      data: {
        verificationStatus: status,
        verifiedBy: actor.id,
        verifiedAt: status === 'VERIFIED' ? reviewedAt : null,
        rejectionReason: status === 'REJECTED' ? parsed.data.rejectionReason : null,
      },
    })
    if (result.count !== 1) {
      return false
    }

    if (status === 'VERIFIED') {
      await tx.membership.upsert({
        where: { alumniId: alumni.id },
        create: { alumniId: alumni.id, status: 'ACTIVE' },
        update: { status: 'ACTIVE' },
      })
      await tx.digitalIdCard.upsert({
        where: { alumniId: alumni.id },
        create: {
          alumniId: alumni.id,
          cardNumber: `UETMAA-${alumni.graduationYear}-${alumni.id.toUpperCase()}`,
        },
        update: { isActive: true },
      })
    }
    await tx.auditLog.create({
      data: {
        performedById: actor.id,
        action: status === 'VERIFIED' ? 'ALUMNI_VERIFIED' : 'ALUMNI_REJECTED',
        targetType: 'Alumni',
        targetId: alumni.id,
        details: {
          verificationStatus: status,
          ...(status === 'REJECTED' ? { reason: parsed.data.rejectionReason } : {}),
        },
      },
    })
    return true
  })
  if (!updated) {
    return NextResponse.json({ error: 'This profile was already reviewed. Refresh the page and try again.' }, { status: 409 })
  }

  return NextResponse.json({ success: true, status })
}
