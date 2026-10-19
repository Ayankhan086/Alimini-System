import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'

const updateSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('SET_ACTIVE'), isActive: z.boolean() }),
  z.object({ action: z.literal('DEMOTE_SUB_ADMIN') }),
])

export async function PATCH(
  request: Request,
  context: RouteContext<'/api/admin/access/users/[id]'>,
) {
  const actor = await getActiveSessionUser()
  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params
  const parsed = updateSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid account action.' }, { status: 400 })
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const target = await tx.user.findUnique({
        where: { id },
        select: { id: true, role: true, isActive: true },
      })
      if (!target) return { error: 'Account not found.', status: 404 as const }

      if (parsed.data.action === 'DEMOTE_SUB_ADMIN') {
        if (target.role !== 'SUB_ADMIN') {
          return { error: 'Only a sub-admin account can be demoted.', status: 409 as const }
        }
        const assignment = await tx.subAdmin.findUnique({
          where: { userId: id },
          select: { id: true, facultyId: true },
        })
        if (!assignment) {
          return { error: 'The sub-admin assignment is inconsistent and requires administrator review.', status: 409 as const }
        }
        await tx.subAdmin.delete({ where: { id: assignment.id } })
        await tx.faculty.update({
          where: { id: assignment.facultyId },
          data: { isSubAdmin: false, promotedAt: null },
        })
        await tx.user.update({ where: { id }, data: { role: 'FACULTY' } })
        await tx.auditLog.create({
          data: {
            performedById: actor.id,
            action: 'ROLE_CHANGED',
            targetType: 'User',
            targetId: id,
            details: { from: 'SUB_ADMIN', to: 'FACULTY' },
          },
        })
        return { success: true }
      }

      const isActive = parsed.data.isActive
      if (actor.id === id && !isActive) {
        return { error: 'You cannot deactivate your own account.', status: 409 as const }
      }
      if (target.isActive === isActive) return { success: true }
      if (!isActive && target.role === 'SUPER_ADMIN') {
        const activeSuperAdmins = await tx.user.count({
          where: { role: 'SUPER_ADMIN', isActive: true },
        })
        if (activeSuperAdmins <= 1) {
          return { error: 'The last active super-admin account cannot be deactivated.', status: 409 as const }
        }
      }
      const demotedSubAdmin = !isActive && target.role === 'SUB_ADMIN'
      if (demotedSubAdmin) {
        const assignment = await tx.subAdmin.findUnique({
          where: { userId: id },
          select: { id: true, facultyId: true },
        })
        if (assignment) {
          await tx.subAdmin.delete({ where: { id: assignment.id } })
          await tx.faculty.update({
            where: { id: assignment.facultyId },
            data: { isSubAdmin: false, promotedAt: null },
          })
        }
      }
      await tx.user.update({
        where: { id },
        data: { isActive, ...(demotedSubAdmin ? { role: 'FACULTY' as const } : {}) },
      })
      if (demotedSubAdmin) {
        await tx.auditLog.create({
          data: {
            performedById: actor.id,
            action: 'ROLE_CHANGED',
            targetType: 'User',
            targetId: id,
            details: { from: 'SUB_ADMIN', to: 'FACULTY', reason: 'Account deactivated' },
          },
        })
      }
      await tx.auditLog.create({
        data: {
          performedById: actor.id,
          action: isActive ? 'ROLE_CHANGED' : 'USER_SUSPENDED',
          targetType: 'User',
          targetId: id,
          details: { isActive, ...(demotedSubAdmin ? { role: 'FACULTY' } : {}) },
        },
      })
      return { success: true }
    }, { isolationLevel: 'Serializable' })

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error('[ADMIN_ACCOUNT_UPDATE_ERROR]', error)
    return NextResponse.json({ error: 'Account update failed. Refresh and try again.' }, { status: 409 })
  }
}
