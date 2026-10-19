import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(12).max(100),
}).refine(({ currentPassword, newPassword }) => currentPassword !== newPassword, {
  message: 'Choose a password different from your current password.',
  path: ['newPassword'],
})

export async function PATCH(request: Request) {
  const actor = await getActiveSessionUser()
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = passwordChangeSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid password details.' }, { status: 400 })
  }

  const account = await prisma.user.findUnique({
    where: { id: actor.id },
    select: { passwordHash: true },
  })
  if (!account) return NextResponse.json({ error: 'Account not found.' }, { status: 404 })

  const currentPasswordMatches = await bcrypt.compare(parsed.data.currentPassword, account.passwordHash)
  if (!currentPasswordMatches) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12)
  await prisma.user.update({
    where: { id: actor.id },
    data: { passwordHash },
  })

  return NextResponse.json({ success: true })
}
