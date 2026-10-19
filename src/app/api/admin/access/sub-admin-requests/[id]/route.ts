import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'

const reviewSchema = z.object({
  decision: z.enum(['APPROVED', 'REJECTED']),
  rejectionReason: z.string().trim().max(500).optional(),
}).superRefine((data, context) => {
  if (data.decision === 'REJECTED' && !data.rejectionReason) {
    context.addIssue({ code: 'custom', path: ['rejectionReason'], message: 'Add a reason for rejecting this request.' })
  }
})

export async function PATCH(
  request: Request,
  context: RouteContext<'/api/admin/access/sub-admin-requests/[id]'>,
) {
  const actor = await getActiveSessionUser()
  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params
  const parsed = reviewSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid review decision.' }, { status: 400 })
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const subAdminRequest = await tx.subAdminRequest.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          departmentId: true,
          facultyId: true,
          faculty: {
            select: {
              isSubAdmin: true,
              userId: true,
              user: { select: { isActive: true, role: true } },
            },
          },
        },
      })
      if (!subAdminRequest) return { error: 'Request not found.', status: 404 as const }
      if (subAdminRequest.status !== 'PENDING') return { error: 'This request has already been reviewed.', status: 409 as const }

      const updated = await tx.subAdminRequest.updateMany({
        where: { id, status: 'PENDING' },
        data: {
          status: parsed.data.decision,
          reviewedById: actor.id,
          reviewedAt: new Date(),
          rejectionReason: parsed.data.decision === 'REJECTED' ? parsed.data.rejectionReason : null,
        },
      })
      if (updated.count !== 1) return { error: 'This request has already been reviewed.', status: 409 as const }

      if (parsed.data.decision === 'REJECTED') return { success: true, decision: 'REJECTED' }
      if (!subAdminRequest.faculty.user.isActive || subAdminRequest.faculty.user.role !== 'FACULTY' || subAdminRequest.faculty.isSubAdmin) {
        throw new Error('Faculty account is inactive or no longer eligible for promotion.')
      }
      const existingAssignment = await tx.subAdmin.findUnique({
        where: { departmentId: subAdminRequest.departmentId },
        select: { id: true },
      })
      if (existingAssignment) {
        throw new Error('This department already has an active sub-admin.')
      }

      await tx.subAdmin.create({
        data: {
          userId: subAdminRequest.faculty.userId,
          departmentId: subAdminRequest.departmentId,
          facultyId: subAdminRequest.facultyId,
          requestId: subAdminRequest.id,
          approvedById: actor.id,
        },
      })
      await tx.faculty.update({
        where: { id: subAdminRequest.facultyId },
        data: { isSubAdmin: true, promotedAt: new Date() },
      })
      await tx.user.update({
        where: { id: subAdminRequest.faculty.userId },
        data: { role: 'SUB_ADMIN' },
      })
      await tx.subAdminRequest.updateMany({
        where: {
          departmentId: subAdminRequest.departmentId,
          status: 'PENDING',
          id: { not: subAdminRequest.id },
        },
        data: {
          status: 'REJECTED',
          reviewedById: actor.id,
          reviewedAt: new Date(),
          rejectionReason: 'Another faculty member was selected for this department.',
        },
      })
      await tx.auditLog.create({
        data: {
          performedById: actor.id,
          action: 'ROLE_CHANGED',
          targetType: 'User',
          targetId: subAdminRequest.faculty.userId,
          details: { from: 'FACULTY', to: 'SUB_ADMIN', departmentId: subAdminRequest.departmentId, requestId: id },
        },
      })
      return { success: true, decision: 'APPROVED' }
    }, { isolationLevel: 'Serializable' })

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error('[SUB_ADMIN_REQUEST_REVIEW_ERROR]', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Request review failed.' }, { status: 409 })
  }
}
